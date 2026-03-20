"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { useToast } from "./ToastProvider";

interface MenuItemCardProps {
  item: Product;
  date: string;
  index?: number;
}

export function MenuItemCard({ item, date, index = 0 }: MenuItemCardProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const { showToast } = useToast();
  const quantity = getItemQuantity(item.id, date);

  const handleAdd = () => {
    addItem(item, date);
    showToast(`${item.name} added`);
  };

  const animClass = `animate-card-${Math.min(index + 1, 6)}`;

  return (
    <div className={cn("group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300", animClass)}>
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover img-zoom"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        {/* Calorie badge */}
        {item.calories != null && (
          <div className="absolute top-3 left-3">
            <div className="bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
              <svg className="w-4 h-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <span className="text-sm font-semibold text-charcoal">{item.calories} cal</span>
            </div>
          </div>
        )}

        {/* Allergens */}
        {item.allergens?.length > 0 && (
          <div className="absolute top-3 right-3 flex gap-1.5">
            {item.allergens.slice(0, 2).map((allergen) => (
              <span
                key={allergen}
                className="bg-charcoal/70 backdrop-blur-md text-white rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide"
              >
                {allergen}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-base text-charcoal leading-snug">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-charcoal-light mt-1.5 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Macros row */}
        {(item.proteins != null || item.carbs != null || item.fats != null) && (
          <div className="flex items-center gap-4 mt-4 text-sm">
            {item.proteins != null && (
              <span className="text-charcoal-light">
                <span className="font-semibold text-charcoal">{item.proteins}g</span> protein
              </span>
            )}
            {item.proteins != null && item.carbs != null && <span className="text-gray-300">|</span>}
            {item.carbs != null && (
              <span className="text-charcoal-light">
                <span className="font-semibold text-charcoal">{item.carbs}g</span> carbs
              </span>
            )}
            {item.carbs != null && item.fats != null && <span className="text-gray-300">|</span>}
            {item.fats != null && (
              <span className="text-charcoal-light">
                <span className="font-semibold text-charcoal">{item.fats}g</span> fat
              </span>
            )}
          </div>
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <span className="text-lg font-bold text-charcoal">
            {formatPrice(item.totalPrice)}
          </span>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="bg-brand hover:bg-brand-dark text-charcoal text-sm font-semibold px-6 py-2.5 rounded-full transition-all press shadow-sm shadow-brand/20"
            >
              Add to Order
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-gray-warm rounded-full p-1">
              <button
                onClick={() => updateQuantity(item.id, date, quantity - 1)}
                className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center transition-all press-sm hover:bg-gray-50"
              >
                {quantity === 1 ? (
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                )}
              </button>
              <span className="w-8 text-center text-sm font-bold text-charcoal">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, date, quantity + 1)}
                className="w-9 h-9 rounded-full bg-brand shadow-sm flex items-center justify-center transition-all press-sm hover:bg-brand-dark"
              >
                <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
