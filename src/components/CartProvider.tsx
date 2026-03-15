"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { CartItem, MenuItem } from "@/lib/types";
import { mockDiscount } from "@/lib/mock-data";
import { getDayOfWeekFromDate, getNext14Days, formatDateString } from "@/lib/utils";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discountApplied: boolean;
  discountPercent: number;
  discountAmount: number;
  total: number;
  uniqueDays: number;
  daysNeededForDiscount: number;
  addItem: (item: MenuItem, date: string) => void;
  removeItem: (itemId: string, date: string) => void;
  updateQuantity: (itemId: string, date: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string, date: string) => number;
  getItemsByDate: () => Map<string, CartItem[]>;
  datesWithItems: Set<string>;
  copyToNextWeek: () => void;
  copyDayToNextWeek: (date: string) => void;
  hasWeek1Items: boolean;
  hasWeek2Items: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

type Action =
  | { type: "ADD_ITEM"; item: MenuItem; date: string }
  | { type: "REMOVE_ITEM"; itemId: string; date: string }
  | { type: "UPDATE_QTY"; itemId: string; date: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "COPY_WEEK"; validDates: Set<string> }
  | { type: "COPY_DAY"; sourceDate: string; targetDate: string };

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find(
        (i) => i.menuItem.id === action.item.id && i.date === action.date
      );
      if (existing) {
        return state.map((i) =>
          i.menuItem.id === action.item.id && i.date === action.date
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...state,
        { menuItem: action.item, quantity: 1, date: action.date },
      ];
    }
    case "REMOVE_ITEM":
      return state.filter(
        (i) => !(i.menuItem.id === action.itemId && i.date === action.date)
      );
    case "UPDATE_QTY": {
      if (action.quantity <= 0) {
        return state.filter(
          (i) =>
            !(i.menuItem.id === action.itemId && i.date === action.date)
        );
      }
      return state.map((i) =>
        i.menuItem.id === action.itemId && i.date === action.date
          ? { ...i, quantity: action.quantity }
          : i
      );
    }
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.items;
    case "COPY_WEEK": {
      const newItems: CartItem[] = [];
      for (const item of state) {
        // Shift the date by +7 days
        const [y, m, d] = item.date.split("-").map(Number);
        const shifted = new Date(y, m - 1, d);
        shifted.setDate(shifted.getDate() + 7);
        const newDate = formatDateString(shifted);
        // Only add if the target date is within our 14-day window
        if (!action.validDates.has(newDate)) continue;
        // Skip if already exists for that date
        const alreadyExists = state.some(
          (existing) => existing.menuItem.id === item.menuItem.id && existing.date === newDate
        );
        if (!alreadyExists) {
          newItems.push({ ...item, date: newDate });
        }
      }
      return [...state, ...newItems];
    }
    case "COPY_DAY": {
      const dayItems = state.filter((i) => i.date === action.sourceDate);
      const newItems: CartItem[] = [];
      for (const item of dayItems) {
        const alreadyExists = state.some(
          (existing) => existing.menuItem.id === item.menuItem.id && existing.date === action.targetDate
        );
        if (!alreadyExists) {
          newItems.push({ ...item, date: action.targetDate });
        }
      }
      return [...state, ...newItems];
    }
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tazizi-cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "HYDRATE", items: parsed });
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("tazizi-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: MenuItem, date: string) => {
    dispatch({ type: "ADD_ITEM", item, date });
  }, []);

  const removeItem = useCallback((itemId: string, date: string) => {
    dispatch({ type: "REMOVE_ITEM", itemId, date });
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, date: string, quantity: number) => {
      dispatch({ type: "UPDATE_QTY", itemId, date, quantity });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const copyToNextWeek = useCallback(() => {
    const days = getNext14Days();
    const validDates = new Set(days.map((d) => d.date));
    dispatch({ type: "COPY_WEEK", validDates });
  }, []);

  const copyDayToNextWeek = useCallback((sourceDate: string) => {
    const [y, m, d] = sourceDate.split("-").map(Number);
    const shifted = new Date(y, m - 1, d);
    shifted.setDate(shifted.getDate() + 7);
    const targetDate = formatDateString(shifted);
    // Only copy if target is within 14-day window
    const days = getNext14Days();
    const validDates = new Set(days.map((dd) => dd.date));
    if (validDates.has(targetDate)) {
      dispatch({ type: "COPY_DAY", sourceDate, targetDate });
    }
  }, []);

  const getItemQuantity = useCallback(
    (itemId: string, date: string) => {
      const item = items.find(
        (i) => i.menuItem.id === itemId && i.date === date
      );
      return item?.quantity ?? 0;
    },
    [items]
  );

  const getItemsByDate = useCallback(() => {
    const map = new Map<string, CartItem[]>();
    items.forEach((item) => {
      const existing = map.get(item.date) || [];
      existing.push(item);
      map.set(item.date, existing);
    });
    // Sort by date
    return new Map(
      [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
    );
  }, [items]);

  const datesWithItems = new Set(items.map((i) => i.date));

  // Determine which weeks have items
  const days14 = getNext14Days();
  const week1Dates = new Set(days14.slice(0, 7).map((d) => d.date));
  const week2Dates = new Set(days14.slice(7, 14).map((d) => d.date));
  const hasWeek1Items = items.some((i) => week1Dates.has(i.date));
  const hasWeek2Items = items.some((i) => week2Dates.has(i.date));

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.menuItem.price * i.quantity,
    0
  );

  // Discount based on unique days-of-week covered (not unique dates)
  const uniqueDays = new Set(
    items.map((i) => getDayOfWeekFromDate(i.date))
  ).size;
  const discountApplied =
    mockDiscount.active && uniqueDays >= mockDiscount.minDays;
  const discountPercent = discountApplied ? mockDiscount.percent : 0;
  const discountAmount = discountApplied
    ? Math.round(subtotal * (mockDiscount.percent / 100))
    : 0;
  const total = subtotal - discountAmount;

  const daysNeededForDiscount = mockDiscount.active
    ? Math.max(0, mockDiscount.minDays - uniqueDays)
    : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        discountApplied,
        discountPercent,
        discountAmount,
        total,
        uniqueDays,
        daysNeededForDiscount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        getItemsByDate,
        datesWithItems,
        copyToNextWeek,
        copyDayToNextWeek,
        hasWeek1Items,
        hasWeek2Items,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
