export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayString(): string {
  return toDateString(new Date());
}

export function parseDateString(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(dateStr: string, days: number): string {
  const d = parseDateString(dateStr);
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

export function dayNumberForDate(startDate: string, date: string): number {
  const start = parseDateString(startDate).getTime();
  const current = parseDateString(date).getTime();
  return Math.floor((current - start) / 86400000) + 1;
}

export function currentDayNumber(startDate: string): number {
  return Math.min(Math.max(dayNumberForDate(startDate, todayString()), 0), 30);
}

export function formatNice(dateStr: string): string {
  return parseDateString(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function isValidUsername(username: string): boolean {
  return /^[a-z0-9_-]{2,30}$/.test(username);
}