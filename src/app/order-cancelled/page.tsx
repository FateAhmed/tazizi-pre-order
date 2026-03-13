"use client";

import Link from "next/link";

export default function OrderCancelledPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-charcoal mb-2">
          Payment Cancelled
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Your payment was cancelled. No charges were made. Your cart items are
          still saved — you can try again whenever you&apos;re ready.
        </p>

        <div className="space-y-3">
          <Link
            href="/order"
            className="block w-full bg-brand hover:bg-brand-dark text-white py-3.5 rounded-xl font-semibold text-sm transition-colors"
          >
            Back to Menu
          </Link>
          <Link
            href="/checkout"
            className="block w-full bg-white hover:bg-gray-50 text-charcoal border border-gray-200 py-3.5 rounded-xl font-semibold text-sm transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
