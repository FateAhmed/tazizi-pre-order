import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createPreOrder, getPreOrderSettings, calculateOrder } from "@/lib/firestore";
import type { PreOrderItem } from "@/lib/types";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

interface CheckoutItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  date: string;
}

interface CheckoutBody {
  items: CheckoutItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  locationId: string;
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  try {
    const body: CheckoutBody = await req.json();
    const { items, customerName, customerEmail, customerPhone, locationId } =
      body;

    if (
      !items?.length ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !locationId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Load settings for discount calculation
    const settings = await getPreOrderSettings(locationId);

    // Calculate totals server-side
    const calc = calculateOrder(items, settings);

    // Build pre-order items
    const preOrderItems: PreOrderItem[] = items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      date: item.date,
      ...(calc.discountPercentage > 0 && {
        discountedPrice:
          item.unitPrice * (1 - calc.discountPercentage / 100),
        discountPercentage: calc.discountPercentage,
      }),
    }));

    // Get location name (from first item's context or settings)
    const locationName = locationId; // Will be enriched by machine data later

    // 1. Create preOrder doc in Firestore (pending)
    const { orderId, orderNumber } = await createPreOrder({
      customerName,
      customerEmail,
      customerPhone,
      locationId,
      locationName,
      items: preOrderItems,
      subtotal: calc.subtotal,
      discountAmount: calc.discountAmount,
      vatAmount: calc.vatAmount,
      totalAmount: calc.totalAmount,
    });

    // 2. Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => {
        const [y, m, d] = item.date.split("-").map(Number);
        const dateObj = new Date(y, m - 1, d);
        const dayName = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
        });
        const monthName = dateObj.toLocaleDateString("en-US", {
          month: "short",
        });

        return {
          price_data: {
            currency: "aed",
            product_data: {
              name: item.productName,
              description: `${dayName}, ${monthName} ${d} — for ${customerName}`,
            },
            // Stripe expects amount in smallest unit (fils for AED)
            unit_amount: Math.round(item.unitPrice * 100),
          },
          quantity: item.quantity,
        };
      });

    // 3. Create discount coupon if applicable
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (calc.discountPercentage > 0) {
      const coupon = await stripe.coupons.create({
        percent_off: calc.discountPercentage,
        duration: "once",
        name: `Discount (${calc.discountPercentage}% off)`,
      });
      discounts.push({ coupon: coupon.id });
    }

    const appUrl =
      process.env.APP_URL ||
      "https://pre-order-five.vercel.app";

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: lineItems,
      discounts,
      metadata: {
        orderId,
        orderNumber,
        customerName,
        customerPhone,
        locationId,
      },
      success_url: `${appUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${appUrl}/order-cancelled`,
    });

    return NextResponse.json({
      url: session.url,
      orderId,
      orderNumber,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
