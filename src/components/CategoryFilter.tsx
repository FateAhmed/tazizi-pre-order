"use client";

import { CATEGORIES, CategoryFilter } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: CategoryFilter;
  onSelect: (category: CategoryFilter) => void;
  availableCategories: string[];
}

export function CategoryFilterBar({
  selected,
  onSelect,
  availableCategories,
}: CategoryFilterProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.filter(
          (cat) => cat === "All" || availableCategories.includes(cat)
        ).map((category) => {
          const isActive = selected === category;
          return (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all press border",
                isActive
                  ? "bg-brand text-charcoal border-brand shadow-sm"
                  : "bg-white text-charcoal-light border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
