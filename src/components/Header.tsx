"use client";

import { useCart } from "./CartProvider";

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight tracking-tight">
              Tazizi
            </h1>
            <p className="text-[10px] text-gray-400 leading-none -mt-0.5">
              Healthy. Fresh. Fast.
            </p>
          </div>
        </div>

        {/* Cart button */}
        <button
          onClick={onCartClick}
          className="relative p-2 -mr-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
          aria-label="Open cart"
        >
          <svg
            className="w-6 h-6 text-charcoal"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
