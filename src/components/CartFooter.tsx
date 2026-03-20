"use client";

import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/utils";

interface CartFooterProps {
  onCartClick: () => void;
}

export function CartFooter({ onCartClick }: CartFooterProps) {
  const { totalItems, total, discountApplied, discountPercentage } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-white via-white to-white/0">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onCartClick}
          className="w-full bg-charcoal hover:bg-charcoal-light text-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl shadow-black/15 press transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center text-[13px] font-bold">
              {totalItems}
            </span>
            <span className="text-[14px] font-medium">View Order</span>
          </div>
          <div className="flex items-center gap-2.5">
            {discountApplied && (
              <span className="text-[11px] bg-brand/25 text-brand-light px-2.5 py-0.5 rounded-full font-semibold">
                -{discountPercentage}%
              </span>
            )}
            <span className="text-[15px] font-bold">{formatPrice(total)}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
