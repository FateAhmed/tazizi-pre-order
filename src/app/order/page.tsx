"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Location } from "@/lib/types";
import {
  mockLocations,
  getLocationBySlug,
  getMenuItemsForDay,
} from "@/lib/mock-data";
import { getDubaiDay } from "@/lib/utils";
import { Header } from "@/components/Header";
import { LocationBar } from "@/components/LocationBar";
import { LocationPrompt } from "@/components/LocationPrompt";
import { DaySelector } from "@/components/DaySelector";
import { MenuItemCard } from "@/components/MenuItemCard";
import { DiscountBanner } from "@/components/DiscountBanner";
import { CartDrawer } from "@/components/CartDrawer";
import { CartFooter } from "@/components/CartFooter";
import { Suspense } from "react";

function OrderPageContent() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");

  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [selectedDay, setSelectedDay] = useState(getDubaiDay());
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate location from URL param → cookie → prompt
  useEffect(() => {
    setMounted(true);

    // Try URL param first
    if (locationParam) {
      const loc = getLocationBySlug(locationParam);
      if (loc) {
        setCurrentLocation(loc);
        document.cookie = `tazizi-location=${loc.slug};path=/;max-age=${60 * 60 * 24 * 30}`;
        return;
      }
    }

    // Try cookie
    const cookieMatch = document.cookie.match(/tazizi-location=([^;]+)/);
    if (cookieMatch) {
      const loc = getLocationBySlug(cookieMatch[1]);
      if (loc) {
        setCurrentLocation(loc);
        return;
      }
    }

    // Show prompt
    setShowLocationPrompt(true);
  }, [locationParam]);

  const handleSelectLocation = (location: Location) => {
    setCurrentLocation(location);
    setShowLocationPrompt(false);
    document.cookie = `tazizi-location=${location.slug};path=/;max-age=${60 * 60 * 24 * 30}`;
  };

  const menuItems = useMemo(() => getMenuItemsForDay(selectedDay), [selectedDay]);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const map = new Map<string, typeof menuItems>();
    menuItems.forEach((item) => {
      const existing = map.get(item.category) || [];
      existing.push(item);
      map.set(item.category, existing);
    });
    return map;
  }, [menuItems]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <Header onCartClick={() => setCartOpen(true)} />

      {currentLocation && (
        <LocationBar
          location={currentLocation}
          onChangeLocation={() => setShowLocationPrompt(true)}
        />
      )}

      <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />

      <DiscountBanner />

      {/* Menu items */}
      <div className="max-w-lg mx-auto px-4 pt-4 pb-4">
        {menuItems.length === 0 ? (
          <div className="text-center py-16">
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
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-charcoal mb-1">
              No meals available
            </h3>
            <p className="text-sm text-gray-400">
              No menu items scheduled for this day. Try another day!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(itemsByCategory.entries()).map(
              ([category, categoryItems]) => (
                <div key={category}>
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                    {category}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        dayOfWeek={selectedDay}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Cart footer */}
      <CartFooter onCartClick={() => setCartOpen(true)} />

      {/* Cart drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Location prompt */}
      {showLocationPrompt && (
        <LocationPrompt
          locations={mockLocations.filter((l) => l.isActive)}
          onSelect={handleSelectLocation}
        />
      )}
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}
