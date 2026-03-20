"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { CartItem, Product, PreOrderSettings } from "@/lib/types";
import { getNext14Days, formatDateString } from "@/lib/utils";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discountApplied: boolean;
  discountPercentage: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  totalMeals: number;
  mealsNeededForDiscount: number;
  settings: PreOrderSettings | null;
  setSettings: (s: PreOrderSettings) => void;
  addItem: (product: Product, date: string) => void;
  removeItem: (productId: string, date: string) => void;
  updateQuantity: (productId: string, date: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, date: string) => number;
  getItemsByDate: () => Map<string, CartItem[]>;
  datesWithItems: Set<string>;
  copyToNextWeek: () => void;
  copyDayToNextWeek: (date: string) => void;
  hasWeek1Items: boolean;
  hasWeek2Items: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

type Action =
  | { type: "ADD_ITEM"; product: Product; date: string }
  | { type: "REMOVE_ITEM"; productId: string; date: string }
  | { type: "UPDATE_QTY"; productId: string; date: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "COPY_WEEK"; validDates: Set<string> }
  | { type: "COPY_DAY"; sourceDate: string; targetDate: string };

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find(
        (i) => i.product.id === action.product.id && i.date === action.date
      );
      if (existing) {
        return state.map((i) =>
          i.product.id === action.product.id && i.date === action.date
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...state,
        { product: action.product, quantity: 1, date: action.date },
      ];
    }
    case "REMOVE_ITEM":
      return state.filter(
        (i) => !(i.product.id === action.productId && i.date === action.date)
      );
    case "UPDATE_QTY": {
      if (action.quantity <= 0) {
        return state.filter(
          (i) =>
            !(i.product.id === action.productId && i.date === action.date)
        );
      }
      return state.map((i) =>
        i.product.id === action.productId && i.date === action.date
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
        const [y, m, d] = item.date.split("-").map(Number);
        const shifted = new Date(y, m - 1, d);
        shifted.setDate(shifted.getDate() + 7);
        const newDate = formatDateString(shifted);
        if (!action.validDates.has(newDate)) continue;
        const alreadyExists = state.some(
          (existing) => existing.product.id === item.product.id && existing.date === newDate
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
          (existing) => existing.product.id === item.product.id && existing.date === action.targetDate
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
  const [settingsVal, setSettingsVal] = useReducer(
    (_: PreOrderSettings | null, s: PreOrderSettings | null) => s,
    null
  );

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
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tazizi-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, date: string) => {
    dispatch({ type: "ADD_ITEM", product, date });
  }, []);

  const removeItem = useCallback((productId: string, date: string) => {
    dispatch({ type: "REMOVE_ITEM", productId, date });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, date: string, quantity: number) => {
      dispatch({ type: "UPDATE_QTY", productId, date, quantity });
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
    const days = getNext14Days();
    const validDates = new Set(days.map((dd) => dd.date));
    if (validDates.has(targetDate)) {
      dispatch({ type: "COPY_DAY", sourceDate, targetDate });
    }
  }, []);

  const getItemQuantity = useCallback(
    (productId: string, date: string) => {
      const item = items.find(
        (i) => i.product.id === productId && i.date === date
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
    return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
  }, [items]);

  const datesWithItems = new Set(items.map((i) => i.date));

  const days14 = getNext14Days();
  const week1Dates = new Set(days14.slice(0, 7).map((d) => d.date));
  const week2Dates = new Set(days14.slice(7, 14).map((d) => d.date));
  const hasWeek1Items = items.some((i) => week1Dates.has(i.date));
  const hasWeek2Items = items.some((i) => week2Dates.has(i.date));

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.totalPrice * i.quantity,
    0
  );

  // Discount based on total meal count (from preOrderSettings)
  const totalMeals = totalItems;
  const discountApplied =
    !!settingsVal?.discountEnabled &&
    totalMeals >= (settingsVal?.discountMinMeals ?? Infinity);
  const discountPercentage = discountApplied
    ? settingsVal!.discountPercentage
    : 0;
  const discountAmount = discountApplied
    ? subtotal * (discountPercentage / 100)
    : 0;
  const afterDiscount = subtotal - discountAmount;
  const vatAmount = afterDiscount - afterDiscount / 1.05;
  const total = afterDiscount;

  const mealsNeededForDiscount = settingsVal?.discountEnabled
    ? Math.max(0, (settingsVal.discountMinMeals ?? 0) - totalMeals)
    : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        discountApplied,
        discountPercentage,
        discountAmount,
        vatAmount,
        total,
        totalMeals,
        mealsNeededForDiscount,
        settings: settingsVal,
        setSettings: setSettingsVal,
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
