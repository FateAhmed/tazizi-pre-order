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

/**
 * Returns 14 orderable days starting from tomorrow.
 * Each day includes a `pastCutoff` flag based on 5 PM Dubai cutoff.
 */
export function getNext14Days(): DayInfo[] {
  const now = getDubaiDate();
  const days: DayInfo[] = [];

  // Start from tomorrow (i=1), 14 days
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();

    days.push({
      date: formatDateString(d),
      dayOfWeek,
      dayName: DAY_SHORT[dayOfWeek],
      dateNum: d.getDate(),
      monthShort: MONTH_SHORT[d.getMonth()],
      isToday: false,
      weekLabel: i <= 7 ? "This Week" : "Next Week",
    });
  }

  return days;
}

/**
 * Check if ordering is still open for a given date.
 * cutoffHours = hours before pickup date (midnight) to stop accepting.
 * e.g. cutoffHours=18, pickup=March 21 → cutoff = March 20 06:00 AM
 */
export function isPastCutoff(dateStr: string, cutoffHours: number = 18): boolean {
  const now = getDubaiDate();
  const [y, m, d] = dateStr.split("-").map(Number);
  const pickupDate = new Date(y, m - 1, d, 0, 0, 0, 0);
  const cutoff = new Date(pickupDate.getTime() - cutoffHours * 60 * 60 * 1000);
  return now >= cutoff;
}

/**
 * Returns time remaining until cutoff for the nearest orderable date (tomorrow).
 * cutoffHours = hours before pickup midnight.
 */
export function getCutoffCountdown(cutoffHours: number = 18): { hours: number; minutes: number } | null {
  const now = getDubaiDate();
  // Tomorrow at midnight
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  // Cutoff for tomorrow
  const cutoff = new Date(tomorrow.getTime() - cutoffHours * 60 * 60 * 1000);

  if (now >= cutoff) return null; // Already past cutoff for tomorrow

  const diff = cutoff.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
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
