import rawDays from "@/data/days365.json";

export type Day365 = {
  day: number;
  title: string;
  reflection: string;
  action: string;
  quote: string;
  placeholder?: boolean;
};

const DAYS: readonly Day365[] = (rawDays as Day365[]).slice().sort((a, b) => a.day - b.day);

/** Returns the static content for day N (1..365). */
export function getDay(day: number): Day365 | null {
  if (!Number.isInteger(day) || day < 1 || day > 365) return null;
  return DAYS[day - 1] ?? null;
}

/** All days, in order. Useful for the historic view (only past days are shown). */
export function listDays(): readonly Day365[] {
  return DAYS;
}

/**
 * Computes which day the user is currently on, given the journey start date.
 * "Unlock duro": no skipping. The current day equals the number of calendar
 * days since start_date (1-based), capped at 365.
 *
 * Timezone: we use the user's local day boundary by passing the local Date.
 */
export function computeCurrentDay(startDate: Date, today: Date = new Date()): number {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const oneDayMs = 24 * 60 * 60 * 1000;
  const diff = Math.floor((now.getTime() - start.getTime()) / oneDayMs);
  return Math.max(1, Math.min(365, diff + 1));
}
