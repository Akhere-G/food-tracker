import { TZDate } from "@date-fns/tz";
import type { ReplaceMealRequest } from "./schemas";
import type { MealEntryData } from "./types";

type CreateMealRequestInput = {
  date: string;
  time: string;
  timezone: string;
  entries: MealEntryData[];
};

export function createMealRequest({
  date,
  time,
  timezone,
  entries,
}: CreateMealRequestInput): ReplaceMealRequest {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    throw new Error("Choose a valid date and time.");
  }

  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const eatenAt = new TZDate(
    year,
    month - 1,
    day,
    hour,
    minute,
    timezone,
  );

  if (Number.isNaN(eatenAt.getTime())) {
    throw new Error("Choose a valid date and time.");
  }

  return {
    eatenAt: eatenAt.toISOString(),
    mealEntries: entries.map((entry) => entry.mealEntryInput),
  };
}
