"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { formatPrice, formatDateLabel } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    totalItems,
    subtotal,
    discountApplied,
    discountPercentage,
    discountAmount,
    vatAmount,
    total,
    getItemsByDate,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsByDate = getItemsByDate();
  const uniqueDays = new Set(items.map((i) => i.date)).size;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            quantity: i.quantity,
            unitPrice: i.product.totalPrice,
            date: i.date,
          })),
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          locationId: localStorage.getItem("tazizi-location") || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Redirect to Stripe (cart cleared on success page)
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-28 h-28 bg-gray-warm rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-14 h-14 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Your cart is empty</h2>
          <p className="text-base text-charcoal-light mb-8">Browse the menu and add some healthy meals before checking out.</p>
          <Link href="/order" className="inline-block bg-charcoal hover:bg-charcoal-light text-white px-10 py-4 rounded-2xl font-semibold text-sm transition-colors press">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-warm">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/order" className="w-10 h-10 rounded-full bg-gray-warm hover:bg-gray-100 flex items-center justify-center transition-colors press">
              <svg className="w-5 h-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-charcoal">Checkout</h1>
              <p className="text-sm text-charcoal-light -mt-0.5 hidden sm:block">
                {totalItems} item{totalItems !== 1 ? "s" : ""} across {uniqueDays} day{uniqueDays !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Secure badge */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-charcoal-light">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secure checkout
          </div>
        </div>
      </header>

      {/* Main content — wide two-column on desktop */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ── Left column: Form + Payment ── */}
          <div className="lg:col-span-7 xl:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Step 1: Customer details */}
              <div className="bg-white rounded-2xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h2 className="text-lg font-bold text-charcoal">Your Details</h2>
                    <p className="text-sm text-charcoal-light">This info will appear on your meal labels</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-charcoal-light mb-2 uppercase tracking-wider">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name (printed on each meal label)"
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all placeholder:text-gray-300 placeholder:font-normal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-light mb-2 uppercase tracking-wider">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all placeholder:text-gray-300 placeholder:font-normal"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">We&apos;ll send your receipt here</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-light mb-2 uppercase tracking-wider">
                      Phone / WhatsApp <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+971 50 123 4567"
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all placeholder:text-gray-300 placeholder:font-normal"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">For order updates</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Payment */}
              <div className="bg-white rounded-2xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <h2 className="text-lg font-bold text-charcoal">Payment</h2>
                </div>

                {/* Process steps */}
                <div className="flex items-center gap-0 mb-7">
                  {/* Step: Click pay */}
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center mb-2">
                      <svg className="w-5 h-5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-charcoal">Click pay</span>
                  </div>

                  {/* Connector */}
                  <div className="w-8 h-px bg-gray-200 -mt-5" />

                  {/* Step: Stripe */}
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center mb-2">
                      <svg className="w-5 h-5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-charcoal">Pay securely</span>
                  </div>

                  {/* Connector */}
                  <div className="w-8 h-px bg-gray-200 -mt-5" />

                  {/* Step: Done */}
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center mb-2">
                      <svg className="w-5 h-5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-charcoal">Confirmed</span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Pay button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 text-charcoal py-4 rounded-xl font-bold text-base transition-all press flex items-center justify-center gap-2.5 shadow-sm shadow-brand/25"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>Pay {formatPrice(total)}</>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  You&apos;ll be redirected to Stripe&apos;s secure page to complete payment
                </p>
              </div>
            </form>
          </div>

          {/* ── Right column: Order summary (sticky) ── */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="bg-white rounded-2xl overflow-hidden lg:sticky lg:top-[104px]">
              {/* Summary header */}
              <div className="px-6 lg:px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-charcoal">Order Summary</h2>
                    <p className="text-sm text-charcoal-light mt-0.5">
                      {totalItems} meal{totalItems !== 1 ? "s" : ""} &middot; {uniqueDays} day{uniqueDays !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Link href="/order" className="text-sm font-medium text-brand-dark hover:text-charcoal transition-colors">
                    Edit
                  </Link>
                </div>
              </div>

              {/* Items by date */}
              <div className="max-h-[45vh] overflow-y-auto thin-scrollbar">
                {Array.from(itemsByDate.entries()).map(([date, dayItems]) => (
                  <div key={date} className="border-b border-gray-50 last:border-0">
                    <div className="px-6 lg:px-8 py-2.5 bg-gray-warm/50">
                      <span className="text-[11px] font-bold text-charcoal-light uppercase tracking-widest">
                        {formatDateLabel(date)}
                      </span>
                    </div>
                    <div className="px-6 lg:px-8 py-3 space-y-3">
                      {dayItems.map((cartItem) => (
                        <div key={`${cartItem.product.id}-${date}`} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                            {cartItem.product.imageUrl ? (
                              <Image
                                src={cartItem.product.imageUrl}
                                alt={cartItem.product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-charcoal truncate">{cartItem.product.name}</p>
                            <p className="text-xs text-charcoal-light">Qty: {cartItem.quantity} &middot; {formatPrice(cartItem.product.totalPrice)} each</p>
                          </div>
                          <span className="text-sm font-semibold text-charcoal tabular-nums whitespace-nowrap">
                            {formatPrice(cartItem.product.totalPrice * cartItem.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-6 lg:px-8 py-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-light">Subtotal</span>
                  <span className="font-medium text-charcoal tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-light">Delivery</span>
                  <span className="font-medium text-green-600">Pickup (free)</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-dark flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Weekly discount ({discountPercentage}%)
                    </span>
                    <span className="font-semibold text-brand-dark tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span className="tabular-nums">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
