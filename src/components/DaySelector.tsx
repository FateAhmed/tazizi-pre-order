"use client";

import { DAY_SHORT } from "@/lib/types";
import { cn, getDubaiDay } from "@/lib/utils";
import { useCart } from "./CartProvider";

interface DaySelectorProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
  const todayIndex = getDubaiDay();
  const { items } = useCart();

  // Check which days have cart items
  const daysWithItems = new Set(items.map((i) => i.dayOfWeek));

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-lg mx-auto px-3">
        <div className="flex gap-0.5 py-2 overflow-x-auto scrollbar-hide">
          {DAY_SHORT.map((dayName, index) => {
            const isSelected = selectedDay === index;
            const isToday = todayIndex === index;
            const hasItems = daysWithItems.has(index);

            return (
              <button
                key={index}
                onClick={() => onSelectDay(index)}
                className={cn(
                  "flex-1 min-w-[44px] py-2 px-1 rounded-xl text-center transition-all relative",
                  isSelected
                    ? "bg-brand text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 active:bg-gray-100"
                )}
              >
                <span
                  className={cn(
                    "text-[11px] block leading-none",
                    isSelected ? "text-white/80" : "text-gray-400"
                  )}
                >
                  {dayName}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold block mt-0.5",
                    isSelected ? "text-white" : "text-charcoal"
                  )}
                >
                  {isToday ? "Today" : dayName}
                </span>

                {/* Dot indicator for days with items */}
                {hasItems && !isSelected && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
