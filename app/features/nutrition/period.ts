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
  parse,
  startOfMonth,
  startOfDay,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { isValidDateInput } from "@/lib/date-input";

export const NUTRITION_PERIODS = ["day", "week", "month", "year"] as const;
export type NutritionPeriod = (typeof NUTRITION_PERIODS)[number];
const PICKER_REFERENCE_DATE = new Date(2000, 0, 1);

export function parseNutritionPeriod(value?: string): NutritionPeriod {
  return NUTRITION_PERIODS.find((period) => period === value) ?? "week";
}

export function nutritionPickerAnchor(
  period: NutritionPeriod,
  value: string,
) {
  const inputFormat = {
    day: "yyyy-MM-dd",
    week: "RRRR-'W'II",
    month: "yyyy-MM",
    year: "yyyy",
  }[period];
  const date = parse(value, inputFormat, PICKER_REFERENCE_DATE);
  return isValid(date) ? format(date, "yyyy-MM-dd") : null;
}

function zonedAnchor(timezone: string, value?: string) {
  if (isValidDateInput(value)) {
    const date = new TZDate(`${value}T12:00:00`, timezone);
    if (isValid(date)) return date;
  }
  return TZDate.tz(timezone);
}

export function nutritionPeriodRange(
  period: NutritionPeriod,
  timezone: string,
  anchor?: string,
) {
  const current = zonedAnchor(timezone, anchor);
  const start = periodStart(period, current);
  const inclusiveEnd = periodEnd(period, current);

  return {
    start,
    end: shiftPeriod(period, start, 1),
    anchor: format(start, "yyyy-MM-dd"),
    label: periodLabel(period, start, inclusiveEnd),
    previous: format(shiftPeriod(period, start, -1), "yyyy-MM-dd"),
    next: format(shiftPeriod(period, start, 1), "yyyy-MM-dd"),
    pickerValue: pickerValue(period, start),
  };
}

function periodStart(period: NutritionPeriod, date: Date) {
  if (period === "day") return startOfDay(date);
  if (period === "week") return startOfWeek(date, { weekStartsOn: 1 });
  if (period === "month") return startOfMonth(date);
  return startOfYear(date);
}

function periodEnd(period: NutritionPeriod, date: Date) {
  if (period === "day") return date;
  if (period === "week") return endOfWeek(date, { weekStartsOn: 1 });
  if (period === "month") return endOfMonth(date);
  return endOfYear(date);
}

function shiftPeriod(period: NutritionPeriod, date: Date, amount: number) {
  if (period === "day") return addDays(date, amount);
  if (period === "week") return addWeeks(date, amount);
  if (period === "month") return addMonths(date, amount);
  return addYears(date, amount);
}

function periodLabel(period: NutritionPeriod, start: Date, end: Date) {
  if (period === "day") return format(start, "EEEE, d MMMM yyyy");
  if (period === "week") return `${format(start, "d")}–${format(end, "d MMMM yyyy")}`;
  if (period === "month") return format(start, "MMMM yyyy");
  return format(start, "yyyy");
}

function pickerValue(period: NutritionPeriod, start: Date) {
  if (period === "day") return format(start, "yyyy-MM-dd");
  if (period === "week") return format(start, "RRRR-'W'II");
  if (period === "month") return format(start, "yyyy-MM");
  return format(start, "yyyy");
}
