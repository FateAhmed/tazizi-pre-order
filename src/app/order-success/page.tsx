"use client";

import Link from "next/link";
import { Suspense } from "react";

function OrderSuccessContent() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {/* Success animation */}
        <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-slide-up">
          <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-charcoal mb-2">
          Order Confirmed!
        </h1>
        <p className="text-sm text-gray-500 mb-2">
          Your meals have been pre-ordered successfully
        </p>

        {/* Demo order number */}
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 inline-block mb-6">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider">
            Order Number
          </p>
          <p className="text-lg font-bold text-charcoal tracking-wider">
            TZ-260313-DEMO
          </p>
        </div>

        <div className="space-y-3 text-left bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 text-brand-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">
                Receipt sent to your email
              </p>
              <p className="text-xs text-gray-400">
                Check your inbox for the order details
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 text-brand-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">
                Pick up from your fridge
              </p>
              <p className="text-xs text-gray-400">
                Your meals will be ready at your selected location
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 text-brand-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">
                Look for your label
              </p>
              <p className="text-xs text-gray-400">
                Each meal has a label with your name &mdash; just grab and go!
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/order"
          className="block w-full bg-brand hover:bg-brand-dark text-white py-3.5 rounded-xl font-semibold text-sm transition-colors active:scale-[0.98]"
        >
          Order More Meals
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
