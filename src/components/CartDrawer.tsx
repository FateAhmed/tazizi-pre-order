"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatPrice, formatDateLabel } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    totalItems,
    subtotal,
    discountApplied,
    discountPercent,
    discountAmount,
    total,
    updateQuantity,
    clearCart,
    getItemsByDate,
    copyToNextWeek,
    hasWeek1Items,
    hasWeek2Items,
  } = useCart();

  if (!isOpen) return null;

  const itemsByDate = getItemsByDate();
  const uniqueDates = new Set(items.map((i) => i.date)).size;

  return (
    <div className="fixed inset-0 z-50">
      <div className="overlay-enter absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="drawer-enter absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-charcoal">Your Order</h2>
            <p className="text-sm text-charcoal-light mt-0.5">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
              {items.length > 0 && ` across ${uniqueDates} day${uniqueDates !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-400 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-warm hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto thin-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-12">
              <div className="w-28 h-28 bg-gray-warm rounded-full flex items-center justify-center mb-5">
                <svg className="w-14 h-14 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">No items yet</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Browse the menu and add meals for each day of the week
              </p>
            </div>
          ) : (
            <div className="py-2">
              {Array.from(itemsByDate.entries()).map(([date, dayItems]) => (
                <div key={date}>
                  <div className="px-6 py-3 bg-gray-warm/60">
                    <span className="text-xs font-bold text-charcoal-light uppercase tracking-widest">
                      {formatDateLabel(date)}
                    </span>
                  </div>

                  {dayItems.map((cartItem) => (
                    <div
                      key={`${cartItem.menuItem.id}-${date}`}
                      className="px-6 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <Image
                          src={cartItem.menuItem.imageUrl}
                          alt={cartItem.menuItem.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-charcoal truncate">
                          {cartItem.menuItem.name}
                        </p>
                        <p className="text-sm text-charcoal-light mt-0.5">
                          {formatPrice(cartItem.menuItem.price)} each
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-gray-warm rounded-full p-1">
                        <button
                          onClick={() => updateQuantity(cartItem.menuItem.id, date, cartItem.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-colors press-sm shadow-sm"
                        >
                          {cartItem.quantity === 1 ? (
                            <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                          )}
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-charcoal">{cartItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(cartItem.menuItem.id, date, cartItem.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-brand flex items-center justify-center transition-colors press-sm hover:bg-brand-dark"
                        >
                          <svg className="w-3.5 h-3.5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-6 space-y-3 bg-white">
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-light">Subtotal</span>
              <span className="font-medium text-charcoal tabular-nums">{formatPrice(subtotal)}</span>
            </div>

            {discountApplied && (
              <div className="flex justify-between text-sm text-brand-dark">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Weekly discount ({discountPercent}%)
                </span>
                <span className="font-semibold tabular-nums">-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-charcoal hover:bg-charcoal-light text-white py-4 rounded-2xl font-semibold text-sm transition-colors press"
            >
              Proceed to Checkout
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
