"use client";

import Link from "next/link";

export default function OrderCancelledPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="text-center max-w-sm w-full">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-charcoal mb-2">
          Payment Cancelled
        </h1>
        <p className="text-[14px] text-charcoal-light mb-8 leading-relaxed">
          No charges were made. Your cart items are still saved — try again whenever you&apos;re ready.
        </p>

        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full bg-charcoal hover:bg-charcoal-light text-white py-4 rounded-2xl font-semibold text-[14px] transition-colors press"
          >
            Try Again
          </Link>
          <Link
            href="/order"
            className="block w-full bg-gray-warm hover:bg-gray-100 text-charcoal py-4 rounded-2xl font-semibold text-[14px] transition-colors press"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
