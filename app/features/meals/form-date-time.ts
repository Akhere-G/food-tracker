import { format } from "date-fns";
import { isValidDateInput, isValidTimeInput } from "@/lib/date-input";

export type MealFormSearchParams = {
  date?: string | string[];
  time?: string | string[];
};

export function resolveMealFormDateTime(
  params: MealFormSearchParams,
  fallback: Date,
) {
  return {
    initialDate: isValidDateInput(params.date)
      ? params.date
      : format(fallback, "yyyy-MM-dd"),
    initialTime: isValidTimeInput(params.time)
      ? params.time
      : format(fallback, "HH:mm"),
  };
}
