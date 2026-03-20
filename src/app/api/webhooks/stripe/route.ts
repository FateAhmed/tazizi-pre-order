import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updatePreOrderPayment } from "@/lib/firestore";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error("Webhook: No orderId in session metadata");
      return NextResponse.json({ received: true });
    }

    try {
      await updatePreOrderPayment(
        orderId,
        session.id,
        (session.payment_intent as string) || ""
      );
      console.log(`Webhook: Order ${orderId} marked as paid`);
    } catch (err) {
      console.error(`Webhook: Failed to update order ${orderId}:`, err);
    }
  }

  return NextResponse.json({ received: true });
}
