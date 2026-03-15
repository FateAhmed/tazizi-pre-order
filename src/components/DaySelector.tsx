"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import { cn, getNext14Days } from "@/lib/utils";
import { useCart } from "./CartProvider";

interface DaySelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function DaySelector({ selectedDate, onSelectDate }: DaySelectorProps) {
  const { datesWithItems } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const days = useMemo(() => getNext14Days(), []);

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

  // Scroll selected day into view on mount
  useEffect(() => {
    const idx = days.findIndex((d) => d.date === selectedDate);
    if (idx >= 0) scrollToIndex(idx);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (date: string, index: number) => {
    onSelectDate(date);
    scrollToIndex(index);
  };

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-4">
        <div
          ref={scrollRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
        >
          {days.map((day, index) => {
            const isSelected = selectedDate === day.date;
            const hasItems = datesWithItems.has(day.date);
            // Add a week separator gap before the 8th day
            const isWeekStart = index === 7;

            return (
              <button
                key={day.date}
                ref={(el) => { buttonRefs.current[index] = el; }}
                onClick={() => handleSelect(day.date, index)}
                className={cn(
                  "relative flex flex-col items-center px-3.5 py-2.5 rounded-2xl text-center transition-all press min-w-[60px]",
                  isWeekStart && "ml-3",
                  isSelected
                    ? "bg-charcoal text-white"
                    : "text-charcoal-light hover:bg-gray-100"
                )}
              >
                {/* Day name or "Today" */}
                <span className={cn(
                  "text-[11px] font-semibold uppercase tracking-wide",
                  isSelected ? "text-white/70" : day.isToday ? "text-brand-dark" : "text-charcoal-light"
                )}>
                  {day.isToday ? "Today" : day.dayName}
                </span>

                {/* Date number */}
                <span className={cn(
                  "text-lg font-bold leading-tight mt-0.5",
                  isSelected ? "text-white" : "text-charcoal"
                )}>
                  {day.dateNum}
                </span>

                {/* Month — show on first day and when month changes */}
                <span className={cn(
                  "text-[10px] font-medium leading-none mt-0.5",
                  isSelected ? "text-white/50" : "text-charcoal-light/70"
                )}>
                  {day.monthShort}
                </span>

                {/* Cart indicator dot */}
                {hasItems && !isSelected && (
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
