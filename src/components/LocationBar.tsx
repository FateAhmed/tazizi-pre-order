"use client";

import { Location } from "@/lib/types";

interface LocationBarProps {
  location: Location;
  onChangeLocation: () => void;
}

export function LocationBar({ location, onChangeLocation }: LocationBarProps) {
  return (
    <div className="bg-cream/60 border-b border-cream-dark/30">
      <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-brand/15 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3.5 h-3.5 text-brand-dark"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 leading-none">Pickup from</p>
            <p className="text-sm font-medium text-charcoal truncate">
              {location.name}
            </p>
          </div>
        </div>
        <button
          onClick={onChangeLocation}
          className="text-xs font-medium text-brand-dark hover:text-charcoal transition-colors flex-shrink-0"
        >
          Change
        </button>
      </div>
    </div>
  );
}
