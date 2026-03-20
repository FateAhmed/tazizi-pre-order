"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Machine, Product } from "@/lib/types";
import { getMachine, getPreOrderSettings, getProductsForDate } from "@/lib/firestore";
import { getDubaiDateString, getNext14Days } from "@/lib/utils";
import { Header } from "@/components/Header";
import { DaySelector } from "@/components/DaySelector";
import { MenuItemCard } from "@/components/MenuItemCard";
import { DiscountBanner } from "@/components/DiscountBanner";
import { CartDrawer } from "@/components/CartDrawer";
import { CartFooter } from "@/components/CartFooter";
import { QrScanner } from "@/components/QrScanner";
import { useCart } from "@/components/CartProvider";

function OrderPageContent() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");

  const [machine, setMachine] = useState<Machine | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(getDubaiDateString());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [preOrderDisabled, setPreOrderDisabled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { setSettings } = useCart();

  // Resolve location on mount
  useEffect(() => {
    setMounted(true);
    const locId = locationParam || localStorage.getItem("tazizi-location");
    if (locId) {
      loadLocation(locId);
    } else {
      setLoadingLocation(false);
    }
  }, [locationParam]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadLocation(locId: string) {
    setLoadingLocation(true);
    try {
      const m = await getMachine(locId);
      if (m) {
        setMachine(m);
        setLocationId(locId);
        localStorage.setItem("tazizi-location", locId);

        const settings = await getPreOrderSettings(locId);
        if (settings && !settings.preOrderEnabled) {
          setPreOrderDisabled(true);
          return;
        }
        if (settings) {
          setSettings(settings);
        }
      } else {
        // Invalid location — clear stored value
        localStorage.removeItem("tazizi-location");
      }
    } finally {
      setLoadingLocation(false);
    }
  }

  // Load products when date or location changes
  useEffect(() => {
    if (!locationId) return;
    setLoading(true);
    getProductsForDate(locationId, selectedDate)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [locationId, selectedDate]);

  const handleScanResult = useCallback((slug: string) => {
    setScannerOpen(false);
    setMachine(null);
    loadLocation(slug);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted || loadingLocation) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-[3px] border-gray-200 border-t-brand rounded-full animate-spin" />
        {loadingLocation && (
          <p className="text-sm text-charcoal-light animate-fade-in">Loading your fridge...</p>
        )}
      </div>
    );
  }

  // No location — show scan prompt
  if (!machine) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-charcoal mb-2">Scan to start</h2>
            <p className="text-base text-charcoal-light leading-relaxed mb-8">
              Scan the QR code on your nearest Tazizi fridge to start ordering fresh, healthy meals.
            </p>
            <button
              onClick={() => setScannerOpen(true)}
              className="w-full bg-brand hover:bg-brand-dark text-charcoal py-4 rounded-xl font-bold text-base transition-all press shadow-sm shadow-brand/25 flex items-center justify-center gap-2.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              Open Camera Scanner
            </button>
          </div>
        </div>

        {scannerOpen && (
          <QrScanner
            onScan={handleScanResult}
            onClose={() => setScannerOpen(false)}
          />
        )}
      </>
    );
  }

  // Pre-ordering disabled for this location
  if (preOrderDisabled) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-gray-warm rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Pre-ordering unavailable</h2>
          <p className="text-base text-charcoal-light leading-relaxed">
            Pre-ordering is not currently available at {machine.name}. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-8">
      <Header
        onCartClick={() => setCartOpen(true)}
        locationName={machine.name}
        onChangeLocation={() => setScannerOpen(true)}
      />

      <DaySelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      <DiscountBanner />

      <RepeatDayBanner selectedDate={selectedDate} />

      {/* Menu grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-6 pb-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-[3px] border-gray-200 border-t-brand rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-28 h-28 bg-gray-warm rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-14 h-14 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No meals available</h3>
            <p className="text-base text-charcoal-light max-w-md mx-auto">
              No menu items are scheduled for this date. Try selecting another day!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <MenuItemCard
                key={product.id}
                item={product}
                date={selectedDate}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      <div className="lg:hidden">
        <CartFooter onCartClick={() => setCartOpen(true)} />
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {scannerOpen && (
        <QrScanner
          onScan={handleScanResult}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </div>
  );
}

function RepeatDayBanner({ selectedDate }: { selectedDate: string }) {
  const { datesWithItems, copyDayToNextWeek } = useCart();
  const [copiedDate, setCopiedDate] = useState<string | null>(null);

  const days = useMemo(() => getNext14Days(), []);
  const week1Dates = useMemo(() => new Set(days.slice(0, 7).map((d) => d.date)), [days]);
  const isWeek1Day = week1Dates.has(selectedDate);
  const hasItemsToday = datesWithItems.has(selectedDate);

  const targetDate = useMemo(() => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const shifted = new Date(y, m - 1, d);
    shifted.setDate(shifted.getDate() + 7);
    const ty = shifted.getFullYear();
    const tm = String(shifted.getMonth() + 1).padStart(2, "0");
    const td = String(shifted.getDate()).padStart(2, "0");
    return `${ty}-${tm}-${td}`;
  }, [selectedDate]);

  const targetAlreadyHasItems = datesWithItems.has(targetDate);
  const targetInRange = days.some((d) => d.date === targetDate);

  const show = isWeek1Day && hasItemsToday && !targetAlreadyHasItems && targetInRange;

  const targetDayInfo = days.find((d) => d.date === targetDate);
  const targetLabel = targetDayInfo
    ? `${targetDayInfo.dayName} ${targetDayInfo.dateNum} ${targetDayInfo.monthShort}`
    : "";

  const handleCopy = () => {
    copyDayToNextWeek(selectedDate);
    setCopiedDate(selectedDate);
    setTimeout(() => setCopiedDate(null), 2000);
  };

  const isCopied = copiedDate === selectedDate;

  if (!show) return null;

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-3 animate-fade-in-up">
      <div className="bg-charcoal rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </div>
          <p className="text-sm text-white/80">
            Same for <span className="font-semibold text-white">{targetLabel}</span>?
          </p>
        </div>
        <button
          onClick={handleCopy}
          disabled={isCopied}
          className="flex-shrink-0 bg-brand hover:bg-brand-dark disabled:opacity-70 text-charcoal text-sm font-bold px-5 py-2.5 rounded-xl transition-all press"
        >
          {isCopied ? "Done!" : "Repeat"}
        </button>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-gray-200 border-t-brand rounded-full animate-spin" />
        </div>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}
