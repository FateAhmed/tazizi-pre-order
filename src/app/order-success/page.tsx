"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface SessionInfo {
  orderNumber: string;
  customerEmail: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<SessionInfo | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.orderNumber) setSession(data);
        })
        .catch(() => {});
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="text-center max-w-sm w-full">
        {/* Success icon */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 bg-brand/15 rounded-full animate-fade-in" />
          <div className="absolute inset-3 bg-brand/25 rounded-full animate-fade-in" style={{ animationDelay: "0.1s" }} />
          <div className="absolute inset-6 bg-brand rounded-full flex items-center justify-center animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-charcoal mb-2 animate-fade-in-up">
          Order Confirmed!
        </h1>
        <p className="text-[14px] text-charcoal-light mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Your healthy meals are on the way to the fridge
        </p>

        {/* Order number */}
        <div className="bg-gray-warm rounded-2xl px-5 py-4 mb-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <p className="text-[11px] text-charcoal-light uppercase tracking-widest font-semibold">
            Order Number
          </p>
          <p className="text-2xl font-bold text-charcoal tracking-wider mt-1">
            {session?.orderNumber || "Processing..."}
          </p>
        </div>

        {/* Steps */}
        <div className="bg-gray-warm rounded-2xl p-5 mb-8 text-left space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <StepItem
            icon={
              <svg className="w-4 h-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title="Receipt sent to your email"
            description={session?.customerEmail ? `Check ${session.customerEmail}` : "Check your inbox for order details"}
          />
          <StepItem
            icon={
              <svg className="w-4 h-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            title="Pick up from your fridge"
            description="Your meals will be stocked at your location"
          />
          <StepItem
            icon={
              <svg className="w-4 h-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
            title="Look for your label"
            description="Each meal has your name — just grab and go"
          />
        </div>

        <Link
          href="/order"
          className="block w-full bg-charcoal hover:bg-charcoal-light text-white py-4 rounded-2xl font-semibold text-[14px] transition-colors press"
        >
          Order More Meals
        </Link>
      </div>
    </div>
  );
}

function StepItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-semibold text-charcoal">{title}</p>
        <p className="text-[12px] text-charcoal-light mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-gray-200 border-t-brand rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
