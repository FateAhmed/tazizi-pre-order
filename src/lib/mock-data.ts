import { Location, MenuItem, MenuSchedule, DiscountSettings } from "./types";

export const mockLocations: Location[] = [
  {
    id: "loc-1",
    slug: "marina-01",
    name: "Dubai Marina Mall",
    address: "Dubai Marina Mall, Ground Floor, Near Entrance B",
    isActive: true,
  },
  {
    id: "loc-2",
    slug: "difc-01",
    name: "DIFC Gate Village",
    address: "Gate Village Building 3, Ground Floor Lobby",
    isActive: true,
  },
  {
    id: "loc-3",
    slug: "jlt-01",
    name: "JLT Cluster D",
    address: "Jumeirah Lake Towers, Cluster D, Lobby Level",
    isActive: true,
  },
  {
    id: "loc-4",
    slug: "downtown-01",
    name: "Downtown Boulevard",
    address: "Boulevard Plaza Tower 1, Ground Floor",
    isActive: true,
  },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: "item-1",
    name: "Grilled Chicken Power Bowl",
    description:
      "Tender grilled chicken breast with fluffy quinoa, roasted seasonal vegetables, and house-made tahini dressing",
    price: 3500,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80",
    category: "Bowls",
    isActive: true,
    sortOrder: 1,
    tags: ["High Protein", "Gluten Free"],
    calories: 485,
    protein: 42,
    carbs: 38,
    fat: 16,
  },
  {
    id: "item-2",
    name: "Mediterranean Garden Salad",
    description:
      "Crisp mixed greens, cherry tomatoes, Persian cucumber, crumbled feta, kalamata olives, and lemon herb vinaigrette",
    price: 2800,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&q=80",
    category: "Salads",
    isActive: true,
    sortOrder: 2,
    tags: ["Vegetarian", "Low Cal"],
    calories: 320,
    protein: 12,
    carbs: 24,
    fat: 18,
  },
  {
    id: "item-3",
    name: "Norwegian Salmon Poke",
    description:
      "Fresh Norwegian salmon with sushi rice, edamame, ripe avocado, pickled ginger, and citrus ponzu",
    price: 4200,
    imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=600&h=400&fit=crop&q=80",
    category: "Bowls",
    isActive: true,
    sortOrder: 3,
    tags: ["Omega-3", "High Protein"],
    calories: 520,
    protein: 38,
    carbs: 45,
    fat: 22,
  },
  {
    id: "item-4",
    name: "Classic Falafel Wrap",
    description:
      "Crispy golden falafel, creamy hummus, pickled turnips, fresh herbs, and garlic tahini in warm whole wheat",
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=400&fit=crop&q=80",
    category: "Wraps",
    isActive: true,
    sortOrder: 4,
    tags: ["Vegan", "High Fiber"],
    calories: 410,
    protein: 16,
    carbs: 52,
    fat: 14,
  },
  {
    id: "item-5",
    name: "Spiced Beef Kofta Plate",
    description:
      "Hand-seasoned beef kofta with herbed bulgur wheat, charred peppers, cool tzatziki, and fresh herbs",
    price: 3800,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&q=80",
    category: "Plates",
    isActive: true,
    sortOrder: 5,
    tags: ["High Protein"],
    calories: 560,
    protein: 44,
    carbs: 35,
    fat: 24,
  },
  {
    id: "item-6",
    name: "Green Power Smoothie Bowl",
    description:
      "Spinach, banana, mango, chia seeds, crunchy granola, and a crown of mixed berries",
    price: 2200,
    imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop&q=80",
    category: "Smoothies",
    isActive: true,
    sortOrder: 6,
    tags: ["Vegan", "Superfood"],
    calories: 290,
    protein: 8,
    carbs: 48,
    fat: 9,
  },
  {
    id: "item-7",
    name: "Chicken Shawarma Bowl",
    description:
      "Marinated chicken shawarma with aromatic basmati rice, garlic sauce, crunchy pickles, and fresh salad",
    price: 3200,
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&q=80",
    category: "Bowls",
    isActive: true,
    sortOrder: 7,
    tags: ["High Protein", "Popular"],
    calories: 510,
    protein: 40,
    carbs: 42,
    fat: 18,
  },
  {
    id: "item-8",
    name: "Acai Energy Bowl",
    description:
      "Organic acai blend with almond butter, sliced banana, toasted coconut flakes, and raw honey drizzle",
    price: 2600,
    imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop&q=80",
    category: "Smoothies",
    isActive: true,
    sortOrder: 8,
    tags: ["Vegan", "Antioxidants"],
    calories: 340,
    protein: 10,
    carbs: 52,
    fat: 12,
  },
  {
    id: "item-9",
    name: "Teriyaki Tofu Bowl",
    description:
      "Glazed teriyaki tofu with brown rice, steamed broccoli, edamame, sesame seeds, and pickled radish",
    price: 2900,
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop&q=80",
    category: "Bowls",
    isActive: true,
    sortOrder: 9,
    tags: ["Vegan", "High Protein"],
    calories: 420,
    protein: 24,
    carbs: 50,
    fat: 14,
  },
  {
    id: "item-10",
    name: "Grilled Halloumi Salad",
    description:
      "Golden grilled halloumi on a bed of rocket, roasted beetroot, walnuts, pomegranate, and balsamic glaze",
    price: 3100,
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop&q=80",
    category: "Salads",
    isActive: true,
    sortOrder: 10,
    tags: ["Vegetarian", "High Protein"],
    calories: 380,
    protein: 22,
    carbs: 18,
    fat: 26,
  },
];

export const mockSchedule: MenuSchedule[] = [
  // Grilled Chicken Bowl - Mon to Fri
  ...[1, 2, 3, 4, 5].map((d) => ({ menuItemId: "item-1", dayOfWeek: d, isActive: true })),
  // Mediterranean Salad - Mon to Sat
  ...[1, 2, 3, 4, 5, 6].map((d) => ({ menuItemId: "item-2", dayOfWeek: d, isActive: true })),
  // Salmon Poke Bowl - Tue, Thu
  ...[2, 4].map((d) => ({ menuItemId: "item-3", dayOfWeek: d, isActive: true })),
  // Falafel Wrap - Every day
  ...[0, 1, 2, 3, 4, 5, 6].map((d) => ({ menuItemId: "item-4", dayOfWeek: d, isActive: true })),
  // Beef Kofta Plate - Mon, Wed, Fri
  ...[1, 3, 5].map((d) => ({ menuItemId: "item-5", dayOfWeek: d, isActive: true })),
  // Green Power Smoothie - Mon to Fri
  ...[1, 2, 3, 4, 5].map((d) => ({ menuItemId: "item-6", dayOfWeek: d, isActive: true })),
  // Chicken Shawarma Bowl - Mon to Sat
  ...[1, 2, 3, 4, 5, 6].map((d) => ({ menuItemId: "item-7", dayOfWeek: d, isActive: true })),
  // Acai Energy Bowl - Mon to Fri
  ...[1, 2, 3, 4, 5].map((d) => ({ menuItemId: "item-8", dayOfWeek: d, isActive: true })),
  // Teriyaki Tofu Bowl - Mon, Wed, Thu, Fri
  ...[1, 3, 4, 5].map((d) => ({ menuItemId: "item-9", dayOfWeek: d, isActive: true })),
  // Grilled Halloumi Salad - Tue, Wed, Thu, Sat
  ...[2, 3, 4, 6].map((d) => ({ menuItemId: "item-10", dayOfWeek: d, isActive: true })),
];

export const mockDiscount: DiscountSettings = {
  active: true,
  percent: 10,
  minDays: 5,
};

export function getMenuItemsForDay(dayOfWeek: number): MenuItem[] {
  const activeItemIds = mockSchedule
    .filter((s) => s.dayOfWeek === dayOfWeek && s.isActive)
    .map((s) => s.menuItemId);
  return mockMenuItems.filter(
    (item) => activeItemIds.includes(item.id) && item.isActive
  );
}

export function getLocationBySlug(slug: string): Location | undefined {
  return mockLocations.find((l) => l.slug === slug && l.isActive);
}
