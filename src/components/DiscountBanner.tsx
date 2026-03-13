"use client";

import { useCart } from "./CartProvider";
import { mockDiscount } from "@/lib/mock-data";

export function DiscountBanner() {
  const { discountApplied, daysNeededForDiscount, uniqueDays } = useCart();

  if (!mockDiscount.active) return null;

  if (discountApplied) {
    return (
      <div className="mx-4 mt-3">
        <div className="bg-brand/10 border border-brand/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand/20 rounded-full flex items-center justify-center flex-shrink-0">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-dark">
              {mockDiscount.percent}% weekly discount applied!
            </p>
            <p className="text-xs text-gray-500">
              You&apos;re ordering for {uniqueDays} days — great choice!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (daysNeededForDiscount > 0 && uniqueDays > 0) {
    const progressPercent = Math.round(
      (uniqueDays / mockDiscount.minDays) * 100
    );

    return (
      <div className="mx-4 mt-3">
        <div className="bg-cream/60 border border-cream-dark/30 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center flex-shrink-0">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-charcoal">
                Add meals for{" "}
                <span className="text-brand-dark font-bold">
                  {daysNeededForDiscount} more day
                  {daysNeededForDiscount !== 1 ? "s" : ""}
                </span>{" "}
                to save {mockDiscount.percent}%
              </p>
              {/* Progress bar */}
              <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No items yet — show passive banner
  return (
    <div className="mx-4 mt-3">
      <div className="bg-cream/40 border border-cream-dark/20 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
        <svg
          className="w-4 h-4 text-brand-dark flex-shrink-0"
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
        <p className="text-xs text-gray-500">
          Order for the full week and{" "}
          <span className="font-semibold text-brand-dark">
            save {mockDiscount.percent}%
          </span>
        </p>
      </div>
    </div>
  );
}
