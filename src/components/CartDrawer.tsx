"use client";

import { useCart } from "./CartProvider";
import { DAY_NAMES } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import Link from "next/link";

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
    removeItem,
    clearCart,
    getItemsByDay,
  } = useCart();

  if (!isOpen) return null;

  const itemsByDay = getItemsByDay();

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="cart-drawer-overlay absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="cart-drawer-panel absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-charcoal">Your Order</h2>
            <p className="text-xs text-gray-400">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-400 hover:text-red-600 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-charcoal mb-1">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-400">
                Browse the menu and add items for each day of the week
              </p>
            </div>
          ) : (
            <div className="py-3">
              {Array.from(itemsByDay.entries()).map(([dayOfWeek, dayItems]) => (
                <div key={dayOfWeek} className="mb-4">
                  {/* Day header */}
                  <div className="px-5 py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                        {DAY_NAMES[dayOfWeek]}
                      </span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                  </div>

                  {/* Items */}
                  {dayItems.map((cartItem) => (
                    <div
                      key={`${cartItem.menuItem.id}-${dayOfWeek}`}
                      className="px-5 py-2 flex items-center gap-3"
                    >
                      {/* Item image placeholder */}
                      <div className="w-12 h-12 bg-gradient-to-br from-brand/10 to-cream/40 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">
                          {cartItem.menuItem.category === "Bowls"
                            ? "🥗"
                            : cartItem.menuItem.category === "Salads"
                            ? "🥬"
                            : cartItem.menuItem.category === "Wraps"
                            ? "🌯"
                            : "🍽️"}
                        </span>
                      </div>

                      {/* Item details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">
                          {cartItem.menuItem.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatPrice(cartItem.menuItem.price)}
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateQuantity(
                              cartItem.menuItem.id,
                              dayOfWeek,
                              cartItem.quantity - 1
                            )
                          }
                          className="qty-btn w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          {cartItem.quantity === 1 ? (
                            <svg
                              className="w-3 h-3 text-red-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3 text-charcoal"
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
                          )}
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              cartItem.menuItem.id,
                              dayOfWeek,
                              cartItem.quantity + 1
                            )
                          }
                          className="qty-btn w-7 h-7 rounded-lg bg-brand/10 hover:bg-brand/20 flex items-center justify-center transition-colors"
                        >
                          <svg
                            className="w-3 h-3 text-brand-dark"
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

                      {/* Item total */}
                      <span className="text-xs font-semibold text-charcoal w-16 text-right">
                        {formatPrice(
                          cartItem.menuItem.price * cartItem.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-gray-50/50">
            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>

            {/* Discount */}
            {discountApplied && (
              <div className="flex justify-between text-sm text-brand-dark">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
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
                  Weekly discount ({discountPercent}%)
                </span>
                <span className="font-semibold">
                  -{formatPrice(discountAmount)}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            {/* Checkout button */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-brand hover:bg-brand-dark text-white text-center py-3.5 rounded-xl font-semibold text-sm transition-colors active:scale-[0.98]"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
