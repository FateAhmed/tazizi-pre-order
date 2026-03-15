"use client";

import { useCart } from "./CartProvider";
import { mockDiscount } from "@/lib/mock-data";

export function DiscountBanner() {
  const { discountApplied, daysNeededForDiscount, uniqueDays } = useCart();

  if (!mockDiscount.active) return null;

  const progressPercent =
    uniqueDays > 0 ? Math.round((uniqueDays / mockDiscount.minDays) * 100) : 0;
  const showProgress = !discountApplied && daysNeededForDiscount > 0 && uniqueDays > 0;

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-5">
      <div className="bg-brand-50 rounded-2xl px-5 py-4 flex items-center gap-3 min-h-[56px]">
        {/* Icon — consistent across all states */}
        <div className="flex-shrink-0">
          {discountApplied ? (
            <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <svg className="w-5 h-5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          )}
        </div>

        {/* Text + optional progress */}
        <div className="flex-1 min-w-0">
          {discountApplied ? (
            <p className="text-sm font-semibold text-charcoal">
              {mockDiscount.percent}% weekly discount applied!
            </p>
          ) : showProgress ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-charcoal">
                <span className="font-semibold text-brand-dark">{daysNeededForDiscount} more day{daysNeededForDiscount !== 1 ? "s" : ""}</span> to save {mockDiscount.percent}%
              </p>
              <span className="text-xs font-bold text-charcoal-light flex-shrink-0">{uniqueDays}/{mockDiscount.minDays}</span>
            </div>
          ) : (
            <p className="text-sm text-charcoal-light">
              Order for the full week and <span className="font-semibold text-charcoal">save {mockDiscount.percent}%</span>
            </p>
          )}

          {/* Progress bar — always rendered, hidden when not needed to avoid layout shift */}
          <div
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{ height: showProgress ? 8 : 0, marginTop: showProgress ? 8 : 0, opacity: showProgress ? 1 : 0 }}
          >
            <div className="h-2 bg-brand-light/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-brand-dark rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
