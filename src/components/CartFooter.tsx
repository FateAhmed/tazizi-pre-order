"use client";

import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/utils";

interface CartFooterProps {
  onCartClick: () => void;
}

export function CartFooter({ onCartClick }: CartFooterProps) {
  const { totalItems, total, discountApplied, discountPercent } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="max-w-lg mx-auto">
        <button
          onClick={onCartClick}
          className="w-full bg-charcoal hover:bg-charcoal-light text-white rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-xl shadow-black/20 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
              {totalItems}
            </span>
            <span className="text-sm font-medium">View Order</span>
          </div>
          <div className="flex items-center gap-2">
            {discountApplied && (
              <span className="text-[10px] bg-brand/30 text-brand-light px-2 py-0.5 rounded-full font-medium">
                -{discountPercent}%
              </span>
            )}
            <span className="text-sm font-bold">{formatPrice(total)}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
