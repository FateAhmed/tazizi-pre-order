export function formatPrice(fils: number): string {
  return `AED ${(fils / 100).toFixed(2)}`;
}

export function formatPriceShort(fils: number): string {
  const aed = fils / 100;
  return aed % 1 === 0 ? `${aed}` : `${aed.toFixed(2)}`;
}

export function getDubaiDay(): number {
  const now = new Date();
  const dubaiTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Dubai" })
  );
  return dubaiTime.getDay();
}

export function getDubaiDate(): Date {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dubai" }));
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
  const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TZ-${datePart}-${randPart}`;
}

export function getDubaiDateString(): string {
  const d = getDubaiDate();
  return formatDateString(d);
}

export function formatDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getDayOfWeekFromDate(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

import { DayInfo, DAY_SHORT } from "@/lib/types";

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getNext14Days(): DayInfo[] {
  const today = getDubaiDate();
  const todayDay = today.getDay(); // day of week for today
  const days: DayInfo[] = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();

    // Determine week label based on whether we've crossed into a new week
    // "This Week" for days until the end of the current week (Saturday)
    // "Next Week" for the second set of 7 days
    const weekLabel = i < (7 - todayDay + 7) % 7 + 1 || (todayDay === 0 && i < 7) ? "This Week" : "Next Week";

    days.push({
      date: formatDateString(d),
      dayOfWeek,
      dayName: DAY_SHORT[dayOfWeek],
      dateNum: d.getDate(),
      monthShort: MONTH_SHORT[d.getMonth()],
      isToday: i === 0,
      weekLabel: i < 7 ? "This Week" : "Next Week",
    });
  }

  return days;
}

export function formatDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = DAY_SHORT[date.getDay()];
  return `${dayName}, ${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
}
