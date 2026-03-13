"use client";

import { Location } from "@/lib/types";

interface LocationPromptProps {
  locations: Location[];
  onSelect: (location: Location) => void;
}

export function LocationPrompt({ locations, onSelect }: LocationPromptProps) {
  return (
    <div className="modal-overlay fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="modal-content bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-brand/10 px-6 pt-8 pb-6 text-center">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-white"
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
          <h2 className="text-xl font-semibold text-charcoal">
            Select your fridge location
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose where you&apos;ll pick up your meals
          </p>
        </div>

        {/* Location list */}
        <div className="p-4 max-h-[50vh] overflow-y-auto">
          <div className="space-y-2">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => onSelect(location)}
                className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-brand/40 hover:bg-cream/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 group-hover:bg-brand/10 flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-brand-dark transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-charcoal">
                      {location.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {location.address}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
