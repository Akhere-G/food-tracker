"use client";

import { format, isValid, parse } from "date-fns";
import { useRouter } from "next/navigation";
import type { NutritionPeriod } from "../period";

const REFERENCE_DATE = new Date(2026, 0, 1);

export default function PeriodPicker({
  period,
  value,
  nutrient,
}: {
  period: NutritionPeriod;
  value: string;
  nutrient: string;
}) {
  const router = useRouter();
  const inputType = period === "year" ? "number" : period;

  function updatePeriod(nextValue: string) {
    const anchor = pickerAnchor(period, nextValue);
    if (!anchor) return;
    const query = new URLSearchParams({ period, date: anchor, nutrient });
    router.push(`/nutrition?${query.toString()}`);
  }

  return (
    <input
      aria-label={`Choose ${period}`}
      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      type={inputType}
      value={value}
      min={period === "year" ? "2000" : undefined}
      max={period === "year" ? "2100" : undefined}
      onChange={(event) => updatePeriod(event.target.value)}
    />
  );
}

function pickerAnchor(period: NutritionPeriod, value: string) {
  const inputFormat =
    period === "day"
      ? "yyyy-MM-dd"
      : period === "week"
        ? "RRRR-'W'II"
        : period === "month"
          ? "yyyy-MM"
          : "yyyy";
  const date = parse(value, inputFormat, REFERENCE_DATE);
  return isValid(date) ? format(date, "yyyy-MM-dd") : null;
}
