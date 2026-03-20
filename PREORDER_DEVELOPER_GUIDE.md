# Tazizi Pre-Order System — Developer Reference Document

**For:** Next.js Pre-Order App Developer
**Firebase Project ID:** `tazizi`
**Firestore Database:** `default`
**Date:** March 2026

---

## 1. System Overview & Data Flow

```
Customer scans QR code at fridge
    ↓
Next.js app reads locationId from URL param (?location=marina-01)
    ↓
App stores locationId in browser cookie
    ↓
App reads preOrderSettings/{locationId} → checks preOrderEnabled
    ↓
App reads preOrderMenuSchedule → gets available products per date
    ↓
App reads products/{productId} → gets product details for display
    ↓
Customer selects items, fills checkout form
    ↓
App WRITES to preOrders collection (paymentStatus: 'pending')
    ↓
Stripe Checkout Session (redirect, no CC inputs in your app)
    ↓
Stripe webhook/callback → App UPDATES preOrders doc (paymentStatus: 'paid')
    ↓
Admin panel detects paid order → generates stickers → kitchen prints
    ↓
Admin marks as 'picked_up' → analytics recorded
```

---

## 2. Collections You READ From

### 2.1 `machines/{locationId}` — Location Info

**When to read:** On first page load, to display location name and confirm the customer is at the right fridge.

**Query:** Direct document read by ID:
```js
const doc = await getDoc(doc(db, 'machines', locationId));
```

**Fields you need:**
| Field | Type | Purpose |
|-------|------|---------|
| `name` | string | Display location name (e.g., "Marina Mall Fridge") |
| `location.address` | string | Street address |
| `location.city` | string | City name |
| `location.emirate` | string | Emirate name |
| `status` | string | Check if location is 'online' before allowing orders |
| `isActive` | bool | Must be true to allow orders |

**No batch/transaction needed** — simple read.

---

### 2.2 `preOrderSettings/{locationId}` — Pre-Order Configuration

**When to read:** Immediately after confirming the location exists. This controls whether pre-ordering is enabled and what discount rules apply.

**Query:** Direct document read using locationId as the document ID:
```js
const doc = await getDoc(doc(db, 'preOrderSettings', locationId));
```

**Fields:**
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `preOrderEnabled` | bool | false | **GATE CHECK** — if false, show "Pre-ordering not available" |
| `discountEnabled` | bool | false | Whether to show discount banner |
| `discountPercentage` | double | 10.0 | Discount % (e.g., 10.0 = 10% off) |
| `discountMinMeals` | int | 5 | Minimum meals in one week to qualify for discount |
| `discountBannerText` | string | "10% off when you pre-order for the whole week!" | Banner text to display |
| `cutoffHours` | int | 18 | Hours before pickup date to stop accepting orders. Example: 18 means no orders after 6:00 PM the day before |

**No batch/transaction needed** — simple read.

**Important logic:**
- If `preOrderEnabled` is false, do NOT show the menu
- If `discountEnabled` is true AND the customer selects >= `discountMinMeals` items across the week, apply `discountPercentage` to all items
- Check `cutoffHours` before allowing order submission: if current time is past `(pickupDate - cutoffHours)`, block the order for that date

---

### 2.3 `preOrderMenuSchedule` — Available Products Per Date

**When to read:** After confirming pre-ordering is enabled. Load the menu for the upcoming dates.

**Query:** Compound query — filter by locationId, date range, and published status:
```js
const today = new Date();
today.setHours(0, 0, 0, 0);

const q = query(
  collection(db, 'preOrderMenuSchedule'),
  where('locationId', '==', locationId),
  where('date', '>=', Timestamp.fromDate(today)),
  where('status', '==', 1),  // Only published schedules
  orderBy('date', 'asc')
);

const snapshot = await getDocs(q);
```

**Document ID format:** `{locationId}_{YYYY-MM-DD}` (e.g., `marina-01_2026-03-20`)

**Fields:**
| Field | Type | Purpose |
|-------|------|---------|
| `locationId` | string | Location reference |
| `locationName` | string | Location display name |
| `date` | Timestamp | The specific date this menu applies to |
| `productIds` | string[] | Array of product IDs available on this date |
| `status` | int | 0 = draft (don't show), 1 = published (show to customer) |

**No batch/transaction needed** — simple query.

**Important:**
- Only show documents where `status == 1`
- The `productIds` array contains Firestore document IDs that reference the `products` collection
- A date with no document means no products available — show "No menu available for this date"

**Firestore Index Required:**
```
Collection: preOrderMenuSchedule
Fields: locationId (ASC), date (ASC), status (ASC)
```

---

### 2.4 `products/{productId}` — Product Details

**When to read:** After getting `productIds` from the menu schedule. Fetch product details for display.

**Query:** Fetch multiple products by their IDs:
```js
// For each productId from the menu schedule
const productDoc = await getDoc(doc(db, 'products', productId));

// Or batch read if you have multiple IDs:
// Firestore limits getAll/batched reads to 10 docs at a time in the web SDK.
// Use Promise.all for parallel reads.
const productPromises = productIds.map(id => getDoc(doc(db, 'products', id)));
const productDocs = await Promise.all(productPromises);
```

**Fields you need:**
| Field | Type | Purpose |
|-------|------|---------|
| `name` | string | Product display name |
| `description` | string? | Product description |
| `totalPrice` | double | Price INCLUDING 5% VAT — this is the display price |
| `imageUrl` | string? | Product image URL |
| `calories` | int? | Calories per serving |
| `weight` | double? | Weight in grams |
| `proteins` | double? | Protein content |
| `carbs` | double? | Carbohydrate content |
| `fats` | double? | Fat content |
| `allergens` | string[] | Allergen list (e.g., ["Gluten", "Dairy"]) |
| `ingredients` | string[] | Ingredient list |
| `productType` | string | Always 'fresh' for pre-order items |
| `isActive` | bool | Must be true to display |
| `status` | int | Must be 1 (active) to display |

**Filter rules:**
- Only show where `isActive == true` AND `status == 1`
- `totalPrice` already includes 5% VAT — do NOT add VAT again on display
- For VAT breakdown at checkout: `vatAmount = totalPrice - (totalPrice / 1.05)`

**No batch/transaction needed** — simple reads.

---

## 3. Collections You WRITE To

### 3.1 `preOrders` — Creating a New Pre-Order

**When to write:** When the customer submits the checkout form (BEFORE Stripe payment).

**Operation:** Create a new document with auto-generated ID.

**USE A TRANSACTION for this operation** to ensure the order number is unique:

```js
import { runTransaction, collection, doc, serverTimestamp } from 'firebase/firestore';

const orderRef = doc(collection(db, 'preOrders')); // Auto-generate ID

await runTransaction(db, async (transaction) => {
  // Generate sequential order number
  // Format: PO-YYYYMMDD-XXX (where XXX is sequential for that day)
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  // Count existing orders for today to get sequence number
  // NOTE: You cannot query inside a transaction in Firestore.
  // Instead, use a counter document or generate a UUID-based order number.

  const orderNumber = `PO-${dateStr}-${orderRef.id.substring(0, 6).toUpperCase()}`;

  transaction.set(orderRef, {
    orderNumber: orderNumber,
    customerName: formData.name,        // Required - displayed on meal sticker
    customerEmail: formData.email,      // Required - for receipt
    customerPhone: formData.phone,      // Required - WhatsApp number
    locationId: locationId,             // From cookie/URL param
    locationName: locationName,         // From machines collection read
    pickupDate: Timestamp.fromDate(pickupDate),  // Selected pickup date
    items: cartItems.map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,        // Original price from product
      // Only include these if discount is applied:
      ...(item.discountedPrice && { discountedPrice: item.discountedPrice }),
      ...(item.discountPercentage && { discountPercentage: item.discountPercentage }),
    })),
    subtotal: calculatedSubtotal,       // Sum of all item prices before discount
    discountAmount: calculatedDiscount, // Total discount in AED (0 if no discount)
    vatAmount: calculatedVat,           // 5% VAT on final amount
    totalAmount: calculatedTotal,       // Final amount to charge
    paymentStatus: 'pending',           // ALWAYS start as 'pending'
    stripePaymentIntentId: null,
    stripeSessionId: null,
    orderStatus: 'pending',             // ALWAYS start as 'pending'
    stickersGenerated: false,           // ALWAYS start as false
    stickersGeneratedAt: null,
    inventoryItemIds: [],               // ALWAYS start empty
    notes: formData.notes || null,
    status: 1,                          // 1 = active
    uId: 'customer',                    // Fixed string for customer-created orders
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    timestamp: serverTimestamp(),
  });
});
```

**ALTERNATIVE (simpler, no transaction needed if you don't need sequential order numbers):**
```js
const orderRef = await addDoc(collection(db, 'preOrders'), {
  orderNumber: `PO-${Date.now()}`,     // Timestamp-based unique number
  // ... rest of fields same as above
});
```

---

### 3.2 `preOrders/{orderId}` — Updating After Stripe Payment

**When to write:** After receiving Stripe payment confirmation (webhook or redirect callback).

**Operation:** Update existing document.

**USE A TRANSACTION for this operation** to prevent race conditions (e.g., double payment updates):

```js
import { runTransaction, doc, serverTimestamp } from 'firebase/firestore';

const orderRef = doc(db, 'preOrders', orderId);

await runTransaction(db, async (transaction) => {
  const orderDoc = await transaction.get(orderRef);

  if (!orderDoc.exists()) {
    throw new Error('Order not found');
  }

  const currentData = orderDoc.data();

  // Prevent double-processing
  if (currentData.paymentStatus === 'paid') {
    console.log('Order already marked as paid');
    return;
  }

  transaction.update(orderRef, {
    paymentStatus: 'paid',
    stripePaymentIntentId: paymentIntentId,  // From Stripe (e.g., "pi_3Abc...")
    stripeSessionId: sessionId,              // From Stripe (e.g., "cs_test_...")
    updatedAt: serverTimestamp(),
  });
});
```

**What happens after this update:**
The admin panel has a Firestore listener watching for documents where `paymentStatus == 'paid'` AND `stickersGenerated == false`. When your update fires, the admin panel will:
1. Auto-detect the new paid order
2. Generate inventory items with barcodes
3. Set `stickersGenerated: true` and populate `inventoryItemIds`
4. Set `orderStatus: 'confirmed'`

**You do NOT need to do anything else.** The admin panel handles sticker generation.

---

## 4. Price Calculation Rules

### VAT
- All product prices (`totalPrice`) already include 5% VAT
- To extract VAT: `vatAmount = totalPrice - (totalPrice / 1.05)`
- To get price without VAT: `priceWithoutVat = totalPrice / 1.05`

### Discount Logic
```js
function calculateOrder(cartItems, settings) {
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.unitPrice * item.quantity);
  }, 0);

  let discountAmount = 0;
  let discountPercentage = 0;

  // Check if discount applies
  if (settings.discountEnabled) {
    const totalMeals = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (totalMeals >= settings.discountMinMeals) {
      discountPercentage = settings.discountPercentage;
      discountAmount = subtotal * (discountPercentage / 100);
    }
  }

  const afterDiscount = subtotal - discountAmount;
  const vatAmount = afterDiscount * 0.05;  // 5% VAT
  const totalAmount = afterDiscount + vatAmount;

  return {
    subtotal,           // Before discount, before VAT
    discountAmount,     // Discount in AED
    vatAmount,          // 5% VAT
    totalAmount,        // Final charge amount
    discountPercentage, // For storing in each item
  };
}
```

**Note:** The `totalPrice` field on products ALREADY includes VAT. So when calculating subtotal, you're working with VAT-inclusive prices. The VAT breakdown shown to the customer is for transparency only. The `subtotal` stored should be the sum of unit prices x quantities (VAT-inclusive). The `vatAmount` is then the extractable VAT from the final amount.

---

## 5. Stripe Integration

### Approach: Stripe Checkout Sessions (Redirect)

**Critical security requirement:** Your app must NEVER handle credit card inputs directly. Use Stripe Checkout Sessions which redirect the customer to Stripe's hosted payment page.

### Flow:
1. Customer fills checkout form → you create the `preOrders` document (paymentStatus: 'pending')
2. Call your backend API to create a Stripe Checkout Session
3. Redirect customer to Stripe's hosted checkout page
4. After payment, Stripe redirects back to your success/cancel URL
5. On your success page or via webhook: update the `preOrders` document (paymentStatus: 'paid')

### Stripe Webhook (Recommended for reliability):
Set up a webhook endpoint to listen for `checkout.session.completed` events. This ensures payment is recorded even if the customer closes the browser before being redirected back.

### Email Receipt:
Use Stripe's built-in receipt feature (`payment_intent_data.receipt_email`) when creating the Checkout Session, OR send your own email via a service like SendGrid/Resend.

---

## 6. Checkout Form Required Fields

| Field | Type | Validation | Purpose |
|-------|------|-----------|---------|
| Name | string | Required, min 2 chars | Displayed on meal sticker ("FOR: {name}") |
| Email | string | Required, valid email | For receipt |
| Phone/WhatsApp | string | Required, valid phone | For communication |

---

## 7. Cookie/Location Logic

### QR Code URL Format
```
https://your-domain.com/order?location=marina-01
```

### Implementation:
```js
// On page load:
function getLocationId() {
  // 1. Check URL param first (QR code scan)
  const urlParams = new URLSearchParams(window.location.search);
  const locationFromUrl = urlParams.get('location');

  if (locationFromUrl) {
    // Store in cookie (30 days expiry)
    document.cookie = `tazizi_location=${locationFromUrl}; max-age=${30*24*60*60}; path=/`;
    return locationFromUrl;
  }

  // 2. Fall back to cookie (return visit)
  const cookieMatch = document.cookie.match(/tazizi_location=([^;]+)/);
  if (cookieMatch) {
    return cookieMatch[1];
  }

  // 3. No location found — prompt user or show location selector
  return null;
}
```

---

## 8. Order Cutoff Time Logic

```js
function canOrderForDate(pickupDate, cutoffHours) {
  const now = new Date();
  const cutoff = new Date(pickupDate);
  cutoff.setHours(cutoff.getHours() - cutoffHours);

  return now < cutoff;
}

// Example: cutoffHours = 18, pickupDate = March 21 00:00
// Cutoff time = March 20 06:00 AM
// If current time is March 20 07:00 AM → canOrder = false
// If current time is March 20 05:00 AM → canOrder = true
```

---

## 9. Document Lifecycle & Status Tracking

### Pre-Order Status Flow:
```
pending → confirmed → preparing → ready → picked_up
                                        → cancelled (from any state)
```

### Who Sets Each Status:
| Status | Set By | When |
|--------|--------|------|
| `pending` | **Your app** | When order is created |
| `paid` (paymentStatus) | **Your app** | After Stripe payment confirmation |
| `confirmed` | **Admin panel** | After stickers are generated |
| `preparing` | **Admin panel** | Kitchen starts preparation |
| `ready` | **Admin panel** | Food is ready for pickup |
| `picked_up` | **Admin panel** | Customer picks up food |
| `cancelled` | **Admin panel** | Order is cancelled |

**Your app only writes `pending` and `paid`. All other status changes are made by the admin panel.**

---

## 10. Firestore Indexes Required

Create these composite indexes in Firebase Console → Firestore → Indexes:

### Index 1: Menu Schedule Query
```
Collection: preOrderMenuSchedule
Fields:
  - locationId: Ascending
  - date: Ascending
  - status: Ascending
```

### Index 2: Pre-Orders by Payment Status
```
Collection: preOrders
Fields:
  - paymentStatus: Ascending
  - stickersGenerated: Ascending
```

### Index 3: Pre-Orders by Status and Date
```
Collection: preOrders
Fields:
  - status: Ascending
  - createdAt: Descending
```

### Index 4: Pre-Orders by Location and Pickup Date
```
Collection: preOrders
Fields:
  - locationId: Ascending
  - pickupDate: Ascending
```

---

## 11. Security Rules Considerations

Your app writes to `preOrders` collection. Ensure Firestore security rules allow:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Pre-order menu schedules — read-only for customers
    match /preOrderMenuSchedule/{docId} {
      allow read: if true;
      allow write: if false;  // Only admin panel writes
    }

    // Pre-order settings — read-only for customers
    match /preOrderSettings/{locationId} {
      allow read: if true;
      allow write: if false;  // Only admin panel writes
    }

    // Products — read-only for customers
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
    }

    // Machines/Locations — read-only for customers
    match /machines/{machineId} {
      allow read: if true;
      allow write: if false;
    }

    // Pre-orders — customers can create and update payment status
    match /preOrders/{orderId} {
      allow read: if true;
      allow create: if true;
      // Only allow updating payment-related fields
      allow update: if request.resource.data.diff(resource.data).affectedKeys()
        .hasOnly(['paymentStatus', 'stripePaymentIntentId', 'stripeSessionId', 'updatedAt']);
    }
  }
}
```

**Note:** These are EXAMPLE rules. The Tazizi team will set the actual security rules. Discuss with them before deployment.

---

## 12. Error Handling Checklist

| Scenario | How to Handle |
|----------|--------------|
| Location not found in `machines` | Show "Invalid location" error, suggest scanning QR again |
| `preOrderEnabled` is false | Show "Pre-ordering not available at this location" |
| No menu schedule for selected date | Show "No menu available for this date" |
| Product from schedule is inactive | Skip it in display (don't crash) |
| Order creation fails | Show error, allow retry, do NOT redirect to Stripe |
| Stripe payment fails | Show failure page, order remains `pending` in Firestore |
| Stripe webhook fires but order doc missing | Log error, do NOT crash |
| Cookie has stale locationId | Validate against `machines` collection, clear cookie if invalid |

---

## 13. Complete Example: Order Creation Payload

```json
{
  "orderNumber": "PO-20260320-A1B2C3",
  "customerName": "Ahmed Al Mansouri",
  "customerEmail": "ahmed@example.com",
  "customerPhone": "+971501234567",
  "locationId": "marina-01",
  "locationName": "Marina Mall Fridge",
  "pickupDate": "2026-03-20T00:00:00.000Z",
  "items": [
    {
      "productId": "abc123",
      "productName": "Grilled Chicken Salad",
      "quantity": 1,
      "unitPrice": 35.0
    },
    {
      "productId": "def456",
      "productName": "Beef Shawarma Wrap",
      "quantity": 2,
      "unitPrice": 28.0,
      "discountedPrice": 25.2,
      "discountPercentage": 10.0
    }
  ],
  "subtotal": 91.0,
  "discountAmount": 5.6,
  "vatAmount": 4.27,
  "totalAmount": 89.67,
  "paymentStatus": "pending",
  "stripePaymentIntentId": null,
  "stripeSessionId": null,
  "orderStatus": "pending",
  "stickersGenerated": false,
  "stickersGeneratedAt": null,
  "inventoryItemIds": [],
  "notes": null,
  "status": 1,
  "uId": "customer",
  "createdAt": "<serverTimestamp>",
  "updatedAt": "<serverTimestamp>",
  "timestamp": "<serverTimestamp>"
}
```

---

## 14. After Payment Update Payload

```json
{
  "paymentStatus": "paid",
  "stripePaymentIntentId": "pi_3PxYz123AbC456DeF",
  "stripeSessionId": "cs_test_a1b2c3d4e5f6",
  "updatedAt": "<serverTimestamp>"
}
```

After this update, the admin panel automatically:
1. Detects the paid order via Firestore listener
2. Creates inventory items with barcodes and customer name on stickers
3. Updates the document with `stickersGenerated: true`, `inventoryItemIds: [...]`, `orderStatus: 'confirmed'`

**You do NOT need to handle any of this. It's fully automated on the admin side.**

---

## 15. Summary: What You Build vs What Admin Handles

| Responsibility | Your App (Next.js) | Admin Panel (Flutter) |
|---|---|---|
| Read location info | Yes | - |
| Read menu schedule | Yes | Writes menu schedule |
| Read product details | Yes | Manages products |
| Read discount settings | Yes | Configures settings |
| Create pre-order document | Yes | Views & manages orders |
| Stripe payment flow | Yes | - |
| Update payment status | Yes | - |
| Generate stickers/barcodes | - | Yes (automatic) |
| Update order status | - | Yes |
| Create analytics records | - | Yes (automatic on pickup) |
| Print sticker PDFs | - | Yes |
