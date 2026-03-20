import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updatePreOrderPayment } from "@/lib/firestore";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

export async function GET(req: NextRequest) {
  const stripe = getStripe();
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const orderId = req.nextUrl.searchParams.get("order_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Update Firestore preOrder with payment confirmation
    const firestoreOrderId = orderId || session.metadata?.orderId;
    if (firestoreOrderId) {
      await updatePreOrderPayment(
        firestoreOrderId,
        sessionId,
        session.payment_intent as string
      );
    }

    return NextResponse.json({
      orderNumber: session.metadata?.orderNumber || "Processing...",
      customerEmail:
        session.customer_email || session.customer_details?.email,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
}
