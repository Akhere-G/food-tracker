import { TZDate } from "@date-fns/tz";
import { eachDayOfInterval, format } from "date-fns";
import type { Meal } from "@/db/food-schema";
import { calculateNutrients } from "@/app/features/meals/utils";
import type { ProgressPeriod } from "./period";

export function buildProgressSummary(
  meals: Meal[],
  start: Date,
  end: Date,
  timezone: string,
  period: ProgressPeriod,
) {
  const totals = calculateNutrients(meals.flatMap((meal) => meal.entries));
  const caloriesByDay = new Map<string, number>();

  for (const meal of meals) {
    const key = format(new TZDate(meal.eatenAt, timezone), "yyyy-MM-dd");
    const calories = calculateNutrients(meal.entries).Calories.amount;
    caloriesByDay.set(key, (caloriesByDay.get(key) ?? 0) + calories);
  }

  const days = eachDayOfInterval({
    start,
    end: new Date(end.getTime() - 1),
  }).map((date) => {
    const key = format(date, "yyyy-MM-dd");
    return {
      key,
      label: format(date, "EEE"),
      calories: Math.round(caloriesByDay.get(key) ?? 0),
    };
  });
  const loggedDays = days.filter((day) => day.calories > 0).length;
  const totalCalories = Math.round(totals.Calories.amount);
  const chart =
    period === "year"
      ? Array.from({ length: 12 }, (_, month) => {
          const matchingDays = days.filter(
            (day) => Number(day.key.slice(5, 7)) === month + 1,
          );
          return {
            key: `${start.getFullYear()}-${month + 1}`,
            label: format(new Date(2020, month, 1), "MMM"),
            calories: matchingDays.reduce(
              (sum, day) => sum + day.calories,
              0,
            ),
          };
        })
      : days;

  return {
    totals,
    days,
    chart,
    totalCalories,
    loggedDays,
    dailyAverage: loggedDays ? Math.round(totalCalories / loggedDays) : 0,
  };
}

export type ProgressSummary = ReturnType<typeof buildProgressSummary>;
