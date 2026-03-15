"use client";

import { useCart } from "./CartProvider";

interface HeaderProps {
  onCartClick: () => void;
  locationName?: string;
  onChangeLocation?: () => void;
}

export function Header({ onCartClick, locationName, onChangeLocation }: HeaderProps) {
  const { totalItems, total } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 h-[60px] lg:h-[72px] flex items-center justify-between">
        {/* Left: Logo + location */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 lg:w-10 lg:h-10 bg-brand rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white font-bold text-base lg:text-lg">T</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg lg:text-xl font-bold leading-none tracking-tight text-charcoal">
              Tazizi
            </h1>
            {locationName ? (
              <div className="flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3 text-brand-dark flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-[12px] text-charcoal-light font-medium truncate">
                  {locationName}
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-charcoal-light leading-none mt-0.5">
                Healthy. Fresh. Fast.
              </p>
            )}
          </div>
        </div>

        {/* Center: Location (desktop) */}
        {locationName && (
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-warm">
              <svg className="w-4 h-4 text-brand-dark" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-charcoal">
                {locationName}
              </span>
            </div>
            {onChangeLocation && (
              <button
                onClick={onChangeLocation}
                className="text-xs font-medium text-charcoal-light hover:text-brand-dark transition-colors"
              >
                Change
              </button>
            )}
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Change location (mobile) */}
          {locationName && onChangeLocation && (
            <button
              onClick={onChangeLocation}
              className="lg:hidden w-9 h-9 rounded-full bg-gray-warm hover:bg-gray-100 flex items-center justify-center transition-colors press"
              aria-label="Change location"
            >
              <svg className="w-[18px] h-[18px] text-charcoal-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
              </svg>
            </button>
          )}

          {/* Cart (desktop only) */}
          <button
            onClick={onCartClick}
            className="hidden lg:flex items-center gap-3 px-4 py-2.5 rounded-full bg-charcoal hover:bg-charcoal-light text-white transition-colors press"
            aria-label="Open cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-sm font-semibold">
              {totalItems > 0 ? `${totalItems} items` : "Cart"}
            </span>
            {totalItems > 0 && (
              <span className="bg-brand text-charcoal text-xs font-bold px-2 py-0.5 rounded-full">
                {formatPriceCompact(total)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function formatPriceCompact(fils: number): string {
  return `AED ${(fils / 100).toFixed(0)}`;
}
