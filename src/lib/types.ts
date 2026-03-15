export interface Location {
  id: string;
  slug: string;
  name: string;
  address: string;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in fils (2500 = AED 25.00)
  imageUrl: string;
  category: "Bowls" | "Salads" | "Wraps" | "Plates" | "Smoothies";
  isActive: boolean;
  sortOrder: number;
  tags: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MenuSchedule {
  menuItemId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  isActive: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  date: string; // ISO date string e.g. "2026-03-16"
}

export interface DayInfo {
  date: string;       // "2026-03-16"
  dayOfWeek: number;  // 0=Sunday ... 6=Saturday
  dayName: string;    // "Mon"
  dateNum: number;    // 16
  monthShort: string; // "Mar"
  isToday: boolean;
  weekLabel: string;  // "This Week" or "Next Week"
}

export interface CartState {
  items: CartItem[];
  locationSlug: string | null;
}

export interface DiscountSettings {
  active: boolean;
  percent: number;
  minDays: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  locationId: string;
  status: "pending" | "paid" | "preparing" | "ready" | "completed" | "cancelled";
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  dayOfWeek: number;
}

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const WEEKDAYS = [1, 2, 3, 4, 5] as const;

export const CATEGORIES = ["All", "Bowls", "Salads", "Wraps", "Plates", "Smoothies"] as const;
export type CategoryFilter = (typeof CATEGORIES)[number];
