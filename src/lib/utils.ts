import { DayInfo, DAY_SHORT } from "@/lib/types";

// ─── Price formatting (AED, already includes VAT) ─────────

export function formatPrice(aed: number): string {
  return `AED ${aed.toFixed(2)}`;
}

export function formatPriceShort(aed: number): string {
  return aed % 1 === 0 ? `${aed}` : `${aed.toFixed(2)}`;
}

// ─── Dubai timezone helpers ────────────────────────────────

export function getDubaiDate(): Date {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dubai" }));
}

export function getDubaiDay(): number {
  return getDubaiDate().getDay();
}

export function getDubaiDateString(): string {
  return formatDateString(getDubaiDate());
}

// ─── Date helpers ──────────────────────────────────────────

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

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getNext14Days(): DayInfo[] {
  const today = getDubaiDate();
  const days: DayInfo[] = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();

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

// ─── Misc ──────────────────────────────────────────────────

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
  const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PO-${datePart}-${randPart}`;
}
