import type { TargetType } from "./guidance";

export function formatNutrientAmount(amount: number, unit: string) {
  const maximumFractionDigits = amount > 0 && amount < 10 ? 1 : 0;
  return `${amount.toLocaleString("en-GB", { maximumFractionDigits })} ${unit}`;
}

export function targetLabel(type: TargetType, amount: number, unit: string) {
  const prefix = type === "limit" ? "Limit: ≤" : type === "goal" ? "Goal: ≥" : "Guide:";
  return `${prefix} ${formatNutrientAmount(amount, unit)}`;
}

export function averageLabel(period: "day" | "week" | "month" | "year") {
  return period === "day" ? "today’s total" : "daily average";
}
