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
