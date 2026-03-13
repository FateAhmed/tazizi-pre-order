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
    name: "Grilled Chicken Bowl",
    description:
      "Tender grilled chicken breast with quinoa, roasted vegetables, and tahini dressing",
    price: 3500,
    imageUrl: "/images/grilled-chicken-bowl.jpg",
    category: "Bowls",
    isActive: true,
    sortOrder: 1,
    tags: ["High Protein", "Gluten Free"],
  },
  {
    id: "item-2",
    name: "Mediterranean Salad",
    description:
      "Fresh mixed greens, cherry tomatoes, cucumber, feta cheese, olives, and lemon herb vinaigrette",
    price: 2800,
    imageUrl: "/images/mediterranean-salad.jpg",
    category: "Salads",
    isActive: true,
    sortOrder: 2,
    tags: ["Vegetarian", "Low Cal"],
  },
  {
    id: "item-3",
    name: "Salmon Poke Bowl",
    description:
      "Norwegian salmon with sushi rice, edamame, avocado, pickled ginger, and ponzu sauce",
    price: 4200,
    imageUrl: "/images/salmon-poke.jpg",
    category: "Bowls",
    isActive: true,
    sortOrder: 3,
    tags: ["Omega-3", "High Protein"],
  },
  {
    id: "item-4",
    name: "Falafel Wrap",
    description:
      "Crispy falafel with hummus, pickled turnips, fresh vegetables, and garlic sauce in whole wheat wrap",
    price: 2500,
    imageUrl: "/images/falafel-wrap.jpg",
    category: "Wraps",
    isActive: true,
    sortOrder: 4,
    tags: ["Vegan", "High Fiber"],
  },
  {
    id: "item-5",
    name: "Beef Kofta Plate",
    description:
      "Spiced beef kofta with bulgur wheat, grilled peppers, tzatziki, and fresh herbs",
    price: 3800,
    imageUrl: "/images/beef-kofta.jpg",
    category: "Plates",
    isActive: true,
    sortOrder: 5,
    tags: ["High Protein"],
  },
  {
    id: "item-6",
    name: "Green Power Smoothie Bowl",
    description:
      "Spinach, banana, mango, chia seeds, and granola topped with fresh berries",
    price: 2200,
    imageUrl: "/images/smoothie-bowl.jpg",
    category: "Bowls",
    isActive: true,
    sortOrder: 6,
    tags: ["Vegan", "Superfood"],
  },
  {
    id: "item-7",
    name: "Chicken Shawarma Bowl",
    description:
      "Marinated chicken shawarma with basmati rice, garlic sauce, pickles, and fresh salad",
    price: 3200,
    imageUrl: "/images/shawarma-bowl.jpg",
    category: "Bowls",
    isActive: true,
    sortOrder: 7,
    tags: ["High Protein", "Popular"],
  },
  {
    id: "item-8",
    name: "Acai Energy Bowl",
    description:
      "Organic acai blend with almond butter, banana, coconut flakes, and honey drizzle",
    price: 2600,
    imageUrl: "/images/acai-bowl.jpg",
    category: "Bowls",
    isActive: true,
    sortOrder: 8,
    tags: ["Vegan", "Antioxidants"],
  },
];

// Schedule: which items are available on which days
// Most items available Mon-Fri, some on weekends too
export const mockSchedule: MenuSchedule[] = [
  // Grilled Chicken Bowl - Mon to Fri
  { menuItemId: "item-1", dayOfWeek: 1, isActive: true },
  { menuItemId: "item-1", dayOfWeek: 2, isActive: true },
  { menuItemId: "item-1", dayOfWeek: 3, isActive: true },
  { menuItemId: "item-1", dayOfWeek: 4, isActive: true },
  { menuItemId: "item-1", dayOfWeek: 5, isActive: true },
  // Mediterranean Salad - Mon to Sat
  { menuItemId: "item-2", dayOfWeek: 1, isActive: true },
  { menuItemId: "item-2", dayOfWeek: 2, isActive: true },
  { menuItemId: "item-2", dayOfWeek: 3, isActive: true },
  { menuItemId: "item-2", dayOfWeek: 4, isActive: true },
  { menuItemId: "item-2", dayOfWeek: 5, isActive: true },
  { menuItemId: "item-2", dayOfWeek: 6, isActive: true },
  // Salmon Poke Bowl - Tue, Thu only (premium)
  { menuItemId: "item-3", dayOfWeek: 2, isActive: true },
  { menuItemId: "item-3", dayOfWeek: 4, isActive: true },
  // Falafel Wrap - Every day
  { menuItemId: "item-4", dayOfWeek: 0, isActive: true },
  { menuItemId: "item-4", dayOfWeek: 1, isActive: true },
  { menuItemId: "item-4", dayOfWeek: 2, isActive: true },
  { menuItemId: "item-4", dayOfWeek: 3, isActive: true },
  { menuItemId: "item-4", dayOfWeek: 4, isActive: true },
  { menuItemId: "item-4", dayOfWeek: 5, isActive: true },
  { menuItemId: "item-4", dayOfWeek: 6, isActive: true },
  // Beef Kofta Plate - Mon, Wed, Fri
  { menuItemId: "item-5", dayOfWeek: 1, isActive: true },
  { menuItemId: "item-5", dayOfWeek: 3, isActive: true },
  { menuItemId: "item-5", dayOfWeek: 5, isActive: true },
  // Green Power Smoothie Bowl - Mon to Fri
  { menuItemId: "item-6", dayOfWeek: 1, isActive: true },
  { menuItemId: "item-6", dayOfWeek: 2, isActive: true },
  { menuItemId: "item-6", dayOfWeek: 3, isActive: true },
  { menuItemId: "item-6", dayOfWeek: 4, isActive: true },
  { menuItemId: "item-6", dayOfWeek: 5, isActive: true },
  // Chicken Shawarma Bowl - Mon to Sat
  { menuItemId: "item-7", dayOfWeek: 1, isActive: true },
  { menuItemId: "item-7", dayOfWeek: 2, isActive: true },
  { menuItemId: "item-7", dayOfWeek: 3, isActive: true },
  { menuItemId: "item-7", dayOfWeek: 4, isActive: true },
  { menuItemId: "item-7", dayOfWeek: 5, isActive: true },
  { menuItemId: "item-7", dayOfWeek: 6, isActive: true },
  // Acai Energy Bowl - Mon to Fri
  { menuItemId: "item-8", dayOfWeek: 1, isActive: true },
  { menuItemId: "item-8", dayOfWeek: 2, isActive: true },
  { menuItemId: "item-8", dayOfWeek: 3, isActive: true },
  { menuItemId: "item-8", dayOfWeek: 4, isActive: true },
  { menuItemId: "item-8", dayOfWeek: 5, isActive: true },
];

export const mockDiscount: DiscountSettings = {
  active: true,
  percent: 15,
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
