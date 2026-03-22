"use client";

import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { cn, getNext14Days, isPastCutoff, getCutoffCountdown } from "@/lib/utils";
import { useCart } from "./CartProvider";

interface DaySelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  cutoffHours?: number;
}

export function DaySelector({ selectedDate, onSelectDate, cutoffHours = 18 }: DaySelectorProps) {
  const { datesWithItems } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const days = useMemo(() => getNext14Days(), []);
  const [countdown, setCountdown] = useState(getCutoffCountdown(cutoffHours));

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCutoffCountdown(cutoffHours));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const btn = buttonRefs.current[index];
    const container = scrollRef.current;
    if (btn && container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const scrollLeft = btn.offsetLeft - containerRect.width / 2 + btnRect.width / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const idx = days.findIndex((d) => d.date === selectedDate);
    if (idx >= 0) scrollToIndex(idx);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (date: string, index: number) => {
    if (isPastCutoff(date)) return;
    onSelectDate(date);
    scrollToIndex(index);
  };

  return (
    <div className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-[60px] lg:top-[72px] z-30">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-4">
        {/* Countdown for tomorrow's cutoff */}
        {countdown && (
          <p className="text-xs text-center text-charcoal-light mb-3">
            Order for tomorrow closes in{" "}
            <span className="font-semibold text-charcoal">
              {countdown.hours}h {countdown.minutes}m
            </span>
          </p>
        )}

        <div
          ref={scrollRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
        >
          {days.map((day, index) => {
            const isSelected = selectedDate === day.date;
            const hasItems = datesWithItems.has(day.date);
            const isWeekStart = index === 7;
            const disabled = isPastCutoff(day.date, cutoffHours);

            return (
              <button
                key={day.date}
                ref={(el) => { buttonRefs.current[index] = el; }}
                onClick={() => handleSelect(day.date, index)}
                disabled={disabled}
                className={cn(
                  "relative flex flex-col items-center px-3.5 py-2.5 rounded-2xl text-center transition-all min-w-[60px]",
                  isWeekStart && "ml-3",
                  disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "press",
                  isSelected && !disabled
                    ? "bg-charcoal text-white"
                    : !disabled && "text-charcoal-light hover:bg-gray-100"
                )}
              >
                <span className={cn(
                  "text-[11px] font-semibold uppercase tracking-wide",
                  isSelected ? "text-white/70" : "text-charcoal-light"
                )}>
                  {day.dayName}
                </span>

                <span className={cn(
                  "text-lg font-bold leading-tight mt-0.5",
                  isSelected ? "text-white" : "text-charcoal"
                )}>
                  {day.dateNum}
                </span>

                <span className={cn(
                  "text-[10px] font-medium leading-none mt-0.5",
                  isSelected ? "text-white/50" : "text-charcoal-light/70"
                )}>
                  {day.monthShort}
                </span>

                {hasItems && !isSelected && !disabled && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full" />
                )}
                {hasItems && isSelected && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full ring-2 ring-charcoal" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
