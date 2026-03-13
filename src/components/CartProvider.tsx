"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { CartItem, MenuItem, DAY_SHORT } from "@/lib/types";
import { mockDiscount } from "@/lib/mock-data";

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
  addItem: (item: MenuItem, dayOfWeek: number) => void;
  removeItem: (itemId: string, dayOfWeek: number) => void;
  updateQuantity: (itemId: string, dayOfWeek: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string, dayOfWeek: number) => number;
  getItemsByDay: () => Map<number, CartItem[]>;
}

const CartContext = createContext<CartContextType | null>(null);

type Action =
  | { type: "ADD_ITEM"; item: MenuItem; dayOfWeek: number }
  | { type: "REMOVE_ITEM"; itemId: string; dayOfWeek: number }
  | { type: "UPDATE_QTY"; itemId: string; dayOfWeek: number; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find(
        (i) =>
          i.menuItem.id === action.item.id && i.dayOfWeek === action.dayOfWeek
      );
      if (existing) {
        return state.map((i) =>
          i.menuItem.id === action.item.id && i.dayOfWeek === action.dayOfWeek
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...state,
        { menuItem: action.item, quantity: 1, dayOfWeek: action.dayOfWeek },
      ];
    }
    case "REMOVE_ITEM":
      return state.filter(
        (i) =>
          !(i.menuItem.id === action.itemId && i.dayOfWeek === action.dayOfWeek)
      );
    case "UPDATE_QTY": {
      if (action.quantity <= 0) {
        return state.filter(
          (i) =>
            !(
              i.menuItem.id === action.itemId &&
              i.dayOfWeek === action.dayOfWeek
            )
        );
      }
      return state.map((i) =>
        i.menuItem.id === action.itemId && i.dayOfWeek === action.dayOfWeek
          ? { ...i, quantity: action.quantity }
          : i
      );
    }
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.items;
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

  const addItem = useCallback((item: MenuItem, dayOfWeek: number) => {
    dispatch({ type: "ADD_ITEM", item, dayOfWeek });
  }, []);

  const removeItem = useCallback((itemId: string, dayOfWeek: number) => {
    dispatch({ type: "REMOVE_ITEM", itemId, dayOfWeek });
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, dayOfWeek: number, quantity: number) => {
      dispatch({ type: "UPDATE_QTY", itemId, dayOfWeek, quantity });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const getItemQuantity = useCallback(
    (itemId: string, dayOfWeek: number) => {
      const item = items.find(
        (i) => i.menuItem.id === itemId && i.dayOfWeek === dayOfWeek
      );
      return item?.quantity ?? 0;
    },
    [items]
  );

  const getItemsByDay = useCallback(() => {
    const map = new Map<number, CartItem[]>();
    items.forEach((item) => {
      const existing = map.get(item.dayOfWeek) || [];
      existing.push(item);
      map.set(item.dayOfWeek, existing);
    });
    // Sort by day
    return new Map(
      [...map.entries()].sort(([a], [b]) => a - b)
    );
  }, [items]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.menuItem.price * i.quantity,
    0
  );

  const uniqueDays = new Set(items.map((i) => i.dayOfWeek)).size;
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
        getItemsByDay,
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
