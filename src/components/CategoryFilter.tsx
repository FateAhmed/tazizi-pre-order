"use client";

import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-3">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all press border",
            selected === null
              ? "bg-brand text-charcoal border-brand shadow-sm"
              : "bg-white text-charcoal-light border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all press border",
              selected === cat.id
                ? "bg-brand text-charcoal border-brand shadow-sm"
                : "bg-white text-charcoal-light border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
