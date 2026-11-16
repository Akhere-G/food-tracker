import { TZDate } from "@date-fns/tz";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isValid,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

export type ProgressPeriod = "week" | "month" | "year";

export function parseProgressPeriod(value?: string): ProgressPeriod {
  return value === "month" || value === "year" ? value : "week";
}

function zonedAnchor(timezone: string, value?: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) {
    const date = new TZDate(`${value}T12:00:00`, timezone);
    if (isValid(date)) return date;
  }
  return TZDate.tz(timezone);
}

export function periodRange(
  period: ProgressPeriod,
  timezone: string,
  anchor?: string,
) {
  const now = zonedAnchor(timezone, anchor);
  const start =
    period === "week"
      ? startOfWeek(now, { weekStartsOn: 1 })
      : period === "month"
        ? startOfMonth(now)
        : startOfYear(now);
  const inclusiveEnd =
    period === "week"
      ? endOfWeek(now, { weekStartsOn: 1 })
      : period === "month"
        ? endOfMonth(now)
        : endOfYear(now);
  const end = addDays(inclusiveEnd, 1);
  const previous =
    period === "week"
      ? addWeeks(start, -1)
      : period === "month"
        ? addMonths(start, -1)
        : addYears(start, -1);
  const next =
    period === "week"
      ? addWeeks(start, 1)
      : period === "month"
        ? addMonths(start, 1)
        : addYears(start, 1);

  return {
    start,
    end,
    previous: format(previous, "yyyy-MM-dd"),
    next: format(next, "yyyy-MM-dd"),
    label:
      period === "week"
        ? `${format(start, "d")}–${format(inclusiveEnd, "d MMMM yyyy")}`
        : format(start, period === "month" ? "MMMM yyyy" : "yyyy"),
  };
}

export function dayRange(timezone: string, date?: string) {
  const current = zonedAnchor(timezone, date);
  const start = new TZDate(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    timezone,
  );
  return { start, end: addDays(start, 1), date: format(start, "yyyy-MM-dd") };
}
