import { TZDate } from "@date-fns/tz";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  max,
  min,
} from "date-fns";
import type { NutrientKey } from "@/app/features/food/nutrients";
import type { MealEvent } from "./repository";
import type { NutritionPeriod } from "./period";
import type { NutrientTrendItem } from "./types";

type AmountMap = Map<NutrientKey, number>;

type TrendInput = {
  period: NutritionPeriod;
  start: Date;
  end: Date;
  events: MealEvent[];
  byDay: Map<string, AmountMap>;
  byMeal: Map<string, AmountMap>;
  selectedNutrient: NutrientKey;
  loggedDayKeys: Set<string>;
  timezone: string;
};

export function buildNutrientTrend(input: TrendInput): NutrientTrendItem[] {
  if (input.period === "day") return mealTrend(input);
  if (input.period === "week") return dailyTrend(input);
  if (input.period === "month") return weeklyTrend(input);
  return monthlyTrend(input);
}

function mealTrend({ events, byMeal, selectedNutrient, timezone }: TrendInput) {
  return events
    .toSorted((a, b) => a.eatenAt.getTime() - b.eatenAt.getTime())
    .map((event, index) => ({
      key: event.mealId,
      label: format(new TZDate(event.eatenAt, timezone), "HH:mm"),
      sublabel: `Meal ${index + 1}`,
      amount: byMeal.get(event.mealId)?.get(selectedNutrient) ?? 0,
      logged: true,
    }));
}

function dailyTrend(input: TrendInput) {
  return periodDays(input.start, input.end).map((date) => {
    const key = format(date, "yyyy-MM-dd");
    return {
      key,
      label: format(date, "EEE"),
      sublabel: format(date, "d MMM"),
      amount: input.byDay.get(key)?.get(input.selectedNutrient) ?? 0,
      logged: input.loggedDayKeys.has(key),
    };
  });
}

function weeklyTrend(input: TrendInput) {
  const weeks = eachWeekOfInterval(
    { start: input.start, end: new Date(input.end.getTime() - 1) },
    { weekStartsOn: 1 },
  );
  return weeks.map((week, index) => {
    const start = max([week, input.start]);
    const end = min([
      endOfWeek(week, { weekStartsOn: 1 }),
      endOfMonth(input.start),
    ]);
    return trendBucket(
      `week-${index}`,
      `Wk ${index + 1}`,
      eachDayOfInterval({ start, end }),
      input,
    );
  });
}

function monthlyTrend(input: TrendInput) {
  return eachMonthOfInterval({
    start: input.start,
    end: new Date(input.end.getTime() - 1),
  }).map((month) =>
    trendBucket(
      format(month, "yyyy-MM"),
      format(month, "MMM"),
      eachDayOfInterval({ start: month, end: endOfMonth(month) }),
      input,
    ),
  );
}

function trendBucket(
  key: string,
  label: string,
  days: Date[],
  input: TrendInput,
) {
  const logged = days.filter((date) =>
    input.loggedDayKeys.has(format(date, "yyyy-MM-dd")),
  );
  const total = days.reduce((sum, date) => {
    const dayKey = format(date, "yyyy-MM-dd");
    return sum + (input.byDay.get(dayKey)?.get(input.selectedNutrient) ?? 0);
  }, 0);
  return {
    key,
    label,
    sublabel: `${logged.length} ${logged.length === 1 ? "day" : "days"}`,
    amount: logged.length ? total / logged.length : 0,
    logged: logged.length > 0,
  };
}

function periodDays(start: Date, end: Date) {
  return eachDayOfInterval({ start, end: new Date(end.getTime() - 1) });
}
