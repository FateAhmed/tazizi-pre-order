"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { DAY_NAMES } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    totalItems,
    subtotal,
    discountApplied,
    discountPercent,
    discountAmount,
    total,
    getItemsByDay,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const itemsByDay = getItemsByDay();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate checkout - in production this would call /api/checkout
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For now, go to success page
    clearCart();
    router.push("/order-success?demo=true");
  };

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <h2 className="text-lg font-semibold text-charcoal mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Add some meals before checking out
          </p>
          <Link
            href="/order"
            className="inline-block bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/order"
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg
              className="w-5 h-5 text-charcoal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-base font-semibold">Checkout</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-charcoal">
              Order Summary
            </h2>
          </div>
          <div className="px-5 py-3">
            {Array.from(itemsByDay.entries()).map(([dayOfWeek, dayItems]) => (
              <div key={dayOfWeek} className="mb-3 last:mb-0">
                <p className="text-[11px] font-semibold text-brand-dark uppercase tracking-wider mb-1.5">
                  {DAY_NAMES[dayOfWeek]}
                </p>
                {dayItems.map((cartItem) => (
                  <div
                    key={`${cartItem.menuItem.id}-${dayOfWeek}`}
                    className="flex justify-between py-1"
                  >
                    <span className="text-sm text-gray-600">
                      {cartItem.quantity}x {cartItem.menuItem.name}
                    </span>
                    <span className="text-sm font-medium text-charcoal">
                      {formatPrice(
                        cartItem.menuItem.price * cartItem.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountApplied && (
              <div className="flex justify-between text-sm text-brand-dark">
                <span>Weekly discount ({discountPercent}%)</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-1.5 border-t border-gray-200">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Customer info form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-charcoal">
              Your Details
            </h2>
            <p className="text-xs text-gray-400 -mt-2">
              Your name will be printed on your meal label
            </p>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ahmad"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+971 50 123 4567"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Pay button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-charcoal hover:bg-charcoal-light disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay {formatPrice(total)}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </>
            )}
          </button>

          <p className="text-[11px] text-gray-400 text-center">
            You&apos;ll be redirected to Stripe for secure payment
          </p>
        </form>
      </div>
    </div>
  );
}
