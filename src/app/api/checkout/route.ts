import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getMenuItemsForDay } from "@/lib/mock-data";
import { mockDiscount } from "@/lib/mock-data";
import { getDayOfWeekFromDate } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

interface CheckoutItem {
  menuItemId: string;
  quantity: number;
  date: string;
}

interface CheckoutBody {
  items: CheckoutItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();
    const { items, customerName, customerEmail, customerPhone } = body;

    if (!items?.length || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate items and calculate totals server-side
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let subtotal = 0;

    for (const cartItem of items) {
      const dayOfWeek = getDayOfWeekFromDate(cartItem.date);
      const menuItems = getMenuItemsForDay(dayOfWeek);
      const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId);

      if (!menuItem) {
        return NextResponse.json(
          { error: `Item ${cartItem.menuItemId} not available for ${cartItem.date}` },
          { status: 400 }
        );
      }

      if (cartItem.quantity < 1 || cartItem.quantity > 20) {
        return NextResponse.json(
          { error: "Invalid quantity" },
          { status: 400 }
        );
      }

      // Format date for display
      const [y, m, d] = cartItem.date.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });

      subtotal += menuItem.price * cartItem.quantity;

      lineItems.push({
        price_data: {
          currency: "aed",
          product_data: {
            name: menuItem.name,
            description: `${dayName}, ${monthName} ${d} — for ${customerName}`,
          },
          unit_amount: menuItem.price, // already in fils
        },
        quantity: cartItem.quantity,
      });
    }

    // Calculate discount server-side
    const uniqueDaysOfWeek = new Set(
      items.map((i) => getDayOfWeekFromDate(i.date))
    ).size;
    const discountApplied =
      mockDiscount.active && uniqueDaysOfWeek >= mockDiscount.minDays;

    // Create coupon if discount applies
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (discountApplied) {
      const coupon = await stripe.coupons.create({
        percent_off: mockDiscount.percent,
        duration: "once",
        name: `Weekly Discount (${mockDiscount.percent}% off)`,
      });
      discounts.push({ coupon: coupon.id });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: lineItems,
      discounts,
      metadata: {
        customerName,
        customerPhone,
        itemCount: String(items.length),
      },
      success_url: `${appUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/order-cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
