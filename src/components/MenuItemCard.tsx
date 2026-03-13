"use client";

import { MenuItem } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { useToast } from "./ToastProvider";

interface MenuItemCardProps {
  item: MenuItem;
  dayOfWeek: number;
}

export function MenuItemCard({ item, dayOfWeek }: MenuItemCardProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const { showToast } = useToast();
  const quantity = getItemQuantity(item.id, dayOfWeek);

  const handleAdd = () => {
    addItem(item, dayOfWeek);
    showToast(`${item.name} added to cart`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 animate-slide-up">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-cream/30 to-brand/10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/60 rounded-2xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
              <svg
                className="w-8 h-8 text-brand-dark/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <span className="text-xs text-charcoal/40 font-medium">
              {item.category}
            </span>
          </div>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-medium text-charcoal-light"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-charcoal leading-tight">
          {item.name}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-bold text-charcoal">
            {formatPrice(item.price)}
          </span>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="bg-brand hover:bg-brand-dark active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, dayOfWeek, quantity - 1)}
                className="qty-btn w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-charcoal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="text-sm font-semibold w-5 text-center">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, dayOfWeek, quantity + 1)}
                className="qty-btn w-8 h-8 rounded-lg bg-brand hover:bg-brand-dark flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
