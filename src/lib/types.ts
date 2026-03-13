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
  nameAr?: string;
  description: string;
  price: number; // in fils (2500 = AED 25.00)
  imageUrl: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  tags?: string[];
}

export interface MenuSchedule {
  menuItemId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  isActive: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  dayOfWeek: number;
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

// Weekdays for discount: Mon-Fri (1-5)
export const WEEKDAYS = [1, 2, 3, 4, 5] as const;
