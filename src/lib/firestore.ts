import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  setDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Machine,
  PreOrderSettings,
  MenuSchedule,
  Product,
  PreOrder,
  PreOrderItem,
} from "./types";

// ─── Machines (Locations) ──────────────────────────────────

export async function getMachine(locationId: string): Promise<Machine | null> {
  const snapshot = await getDoc(doc(db, "machines", locationId));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  if (!data.isActive || data.status !== "online") return null;
  return { id: snapshot.id, ...data } as Machine;
}

// ─── Pre-Order Settings ────────────────────────────────────

export async function getPreOrderSettings(
  locationId: string
): Promise<PreOrderSettings | null> {
  const snapshot = await getDoc(doc(db, "preOrderSettings", locationId));
  if (!snapshot.exists()) return null;
  return snapshot.data() as PreOrderSettings;
}

// ─── Menu Schedule ─────────────────────────────────────────

export async function getMenuSchedules(
  locationId: string
): Promise<MenuSchedule[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, "preOrderMenuSchedule"),
    where("locationId", "==", locationId),
    where("date", ">=", Timestamp.fromDate(today)),
    where("status", "==", 1),
    orderBy("date", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      locationId: data.locationId,
      locationName: data.locationName,
      date: data.date.toDate(),
      productIds: data.productIds || [],
      status: data.status,
    } as MenuSchedule;
  });
}

export async function getMenuScheduleForDate(
  locationId: string,
  dateStr: string
): Promise<MenuSchedule | null> {
  const docId = `${locationId}_${dateStr}`;
  const snapshot = await getDoc(doc(db, "preOrderMenuSchedule", docId));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  if (data.status !== 1) return null;
  return {
    id: snapshot.id,
    locationId: data.locationId,
    locationName: data.locationName,
    date: data.date.toDate(),
    productIds: data.productIds || [],
    status: data.status,
  } as MenuSchedule;
}

// ─── Products ──────────────────────────────────────────────

export async function getProduct(productId: string): Promise<Product | null> {
  const snapshot = await getDoc(doc(db, "products", productId));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  if (!data.isActive || data.status !== 1) return null;
  return { id: snapshot.id, ...data } as Product;
}

export async function getProductsByIds(
  productIds: string[]
): Promise<Product[]> {
  if (productIds.length === 0) return [];

  // Fetch in parallel, filter out inactive
  const promises = productIds.map((id) => getDoc(doc(db, "products", id)));
  const snapshots = await Promise.all(promises);

  return snapshots
    .filter((s) => s.exists())
    .map((s) => ({ id: s.id, ...s.data() }) as Product)
    .filter((p) => p.isActive && p.status === 1);
}

export async function getProductsForDate(
  locationId: string,
  dateStr: string
): Promise<Product[]> {
  const schedule = await getMenuScheduleForDate(locationId, dateStr);
  if (!schedule) return [];
  return getProductsByIds(schedule.productIds);
}

// ─── Cutoff Check ──────────────────────────────────────────

export function canOrderForDate(
  pickupDateStr: string,
  cutoffHours: number
): boolean {
  const now = new Date();
  const [y, m, d] = pickupDateStr.split("-").map(Number);
  const pickupDate = new Date(y, m - 1, d);
  const cutoff = new Date(pickupDate.getTime() - cutoffHours * 60 * 60 * 1000);
  return now < cutoff;
}

// ─── Price Calculations ────────────────────────────────────

export function calculateOrder(
  items: { unitPrice: number; quantity: number }[],
  settings: PreOrderSettings | null
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  let discountAmount = 0;
  let discountPercentage = 0;

  if (settings?.discountEnabled) {
    const totalMeals = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalMeals >= settings.discountMinMeals) {
      discountPercentage = settings.discountPercentage;
      discountAmount = subtotal * (discountPercentage / 100);
    }
  }

  const afterDiscount = subtotal - discountAmount;
  // totalPrice already includes VAT, so extract it for display
  const vatAmount = afterDiscount - afterDiscount / 1.05;
  const totalAmount = afterDiscount;

  return {
    subtotal,
    discountAmount,
    discountPercentage,
    vatAmount,
    totalAmount,
  };
}

// ─── Pre-Orders (Write) ────────────────────────────────────

interface CreatePreOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  locationId: string;
  locationName: string;
  items: PreOrderItem[];
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  notes?: string;
}

export async function createPreOrder(
  input: CreatePreOrderInput
): Promise<{ orderId: string; orderNumber: string }> {
  const orderRef = doc(collection(db, "preOrders"));
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const orderNumber = `PO-${dateStr}-${orderRef.id.substring(0, 6).toUpperCase()}`;

  const pickupDates = [...new Set(input.items.map((i) => i.date))];

  await setDoc(orderRef, {
    orderNumber,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    locationId: input.locationId,
    locationName: input.locationName,
    pickupDates,
    items: input.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      date: item.date,
      ...(item.discountedPrice != null && {
        discountedPrice: item.discountedPrice,
      }),
      ...(item.discountPercentage != null && {
        discountPercentage: item.discountPercentage,
      }),
    })),
    subtotal: input.subtotal,
    discountAmount: input.discountAmount,
    vatAmount: input.vatAmount,
    totalAmount: input.totalAmount,
    paymentStatus: "pending",
    stripePaymentIntentId: null,
    stripeSessionId: null,
    orderStatus: "pending",
    stickersGenerated: false,
    stickersGeneratedAt: null,
    inventoryItemIds: [],
    notes: input.notes || null,
    status: 1,
    uId: "customer",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    timestamp: serverTimestamp(),
  });

  return { orderId: orderRef.id, orderNumber };
}

export async function updatePreOrderPayment(
  orderId: string,
  stripeSessionId: string,
  stripePaymentIntentId: string
): Promise<void> {
  const orderRef = doc(db, "preOrders", orderId);

  await runTransaction(db, async (transaction) => {
    const orderDoc = await transaction.get(orderRef);
    if (!orderDoc.exists()) {
      throw new Error("Order not found");
    }

    const currentData = orderDoc.data();
    if (currentData.paymentStatus === "paid") {
      return; // Already paid, skip
    }

    transaction.update(orderRef, {
      paymentStatus: "paid",
      stripePaymentIntentId,
      stripeSessionId,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function getPreOrder(orderId: string): Promise<PreOrder | null> {
  const snapshot = await getDoc(doc(db, "preOrders", orderId));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : data.createdAt,
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : data.updatedAt,
  } as PreOrder;
}
