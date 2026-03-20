// ─── Firestore Document Types ──────────────────────────────

/** machines/{locationId} */
export interface Machine {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    emirate: string;
  };
  status: string; // "online" | "offline"
  isActive: boolean;
}

/** preOrderSettings/{locationId} */
export interface PreOrderSettings {
  preOrderEnabled: boolean;
  discountEnabled: boolean;
  discountPercentage: number;   // e.g. 10.0 = 10%
  discountMinMeals: number;     // min total meals for discount
  discountBannerText: string;
  cutoffHours: number;          // hours before pickup to stop orders
}

/** preOrderMenuSchedule/{locationId}_{YYYY-MM-DD} */
export interface MenuSchedule {
  id: string;
  locationId: string;
  locationName: string;
  date: Date;                   // Firestore Timestamp → Date
  productIds: string[];
  status: number;               // 0=draft, 1=published
}

/** products/{productId} */
export interface Product {
  id: string;
  name: string;
  description?: string;
  totalPrice: number;           // AED, includes 5% VAT
  imageUrl?: string;
  calories?: number;
  weight?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  allergens: string[];
  ingredients: string[];
  productType: string;
  isActive: boolean;
  status: number;               // 1=active
}

/** preOrders/{orderId} — what we write */
export interface PreOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  locationId: string;
  locationName: string;
  pickupDates: string[];        // dates the order covers
  items: PreOrderItem[];
  subtotal: number;             // AED
  discountAmount: number;       // AED
  vatAmount: number;            // AED
  totalAmount: number;          // AED
  paymentStatus: "pending" | "paid" | "failed";
  stripePaymentIntentId: string | null;
  stripeSessionId: string | null;
  orderStatus: "pending" | "confirmed" | "preparing" | "ready" | "picked_up" | "cancelled";
  stickersGenerated: boolean;
  stickersGeneratedAt: Date | null;
  inventoryItemIds: string[];
  notes: string | null;
  status: number;               // 1=active
  uId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PreOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;            // AED (VAT-inclusive)
  date: string;                 // pickup date for this item
  discountedPrice?: number;
  discountPercentage?: number;
}

// ─── Frontend Types ────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
  date: string;                 // ISO date string e.g. "2026-03-16"
}

export interface DayInfo {
  date: string;                 // "2026-03-16"
  dayOfWeek: number;            // 0=Sunday ... 6=Saturday
  dayName: string;              // "Mon"
  dateNum: number;              // 16
  monthShort: string;           // "Mar"
  isToday: boolean;
  weekLabel: string;            // "This Week" or "Next Week"
}

// ─── Constants ─────────────────────────────────────────────

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
