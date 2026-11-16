import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";
import { NUTRIENTS, type NutrientKey } from "@/app/features/food/nutrients";
import type { NutritionProfile } from "@/db/profile-schema";
import { QUERY_NUTRIENTS, TRACKED_NUTRIENTS } from "./definitions";
import { buildNutrientTargets } from "./guidance";
import type { MealEvent, NutrientIntakeRow } from "./repository";
import type { NutritionPeriod } from "./period";
import type {
  NutrientMetric,
  NutrientSource,
  NutritionReport,
} from "./types";
import { buildNutrientTrend } from "./trend";

type AmountMap = Map<NutrientKey, number>;
type SourceMap = Map<NutrientKey, Map<string, NutrientSource>>;

type ReportInput = {
  events: MealEvent[];
  rows: NutrientIntakeRow[];
  profile: NutritionProfile;
  period: NutritionPeriod;
  start: Date;
  end: Date;
  selectedNutrient: NutrientKey;
};

export function buildNutritionReport({
  events,
  rows,
  profile,
  period,
  start,
  end,
  selectedNutrient,
}: ReportInput): NutritionReport {
  const timezone = profile.timezone;
  const totals = createAmountMap();
  const byDay = new Map<string, AmountMap>();
  const byMeal = new Map<string, AmountMap>();
  const sources = new Map() as SourceMap;

  for (const row of rows) {
    const nutrientName = asTrackedNutrient(row.nutrientName);
    if (!nutrientName || nutrientName === "Unsaturated fat") continue;
    const amount =
      (Number(row.amountInGrams) * Number(row.amountPer100g)) / 100;
    const dayKey = format(new TZDate(row.eatenAt, timezone), "yyyy-MM-dd");

    addAmount(totals, nutrientName, amount);
    addAmount(getAmountMap(byDay, dayKey), nutrientName, amount);
    addAmount(getAmountMap(byMeal, row.mealId), nutrientName, amount);
    addSource(sources, nutrientName, row.foodId, row.foodName, amount);
  }

  deriveUnsaturated(totals);
  byDay.forEach(deriveUnsaturated);
  byMeal.forEach(deriveUnsaturated);
  deriveUnsaturatedSources(sources);

  const loggedDayKeys = new Set(
    events.map((event) =>
      format(new TZDate(event.eatenAt, timezone), "yyyy-MM-dd"),
    ),
  );
  const loggedDays = loggedDayKeys.size;
  const targets = buildNutrientTargets(profile);
  const focusedNutrients = nutrientFocus(profile.nutritionPriorities);
  const metrics = TRACKED_NUTRIENTS.map((key) => {
    const periodTotal = totals.get(key) ?? 0;
    const dailyAverage = loggedDays ? periodTotal / loggedDays : 0;
    const target = targets[key];
    return {
      key,
      name: NUTRIENTS[key].name,
      unit: NUTRIENTS[key].unit,
      periodTotal,
      dailyAverage,
      dailyTarget: target.amount,
      targetType: target.type,
      progress: target.amount ? dailyAverage / target.amount : 0,
      focused: focusedNutrients.has(key),
      derived: key === "Unsaturated fat",
    } satisfies NutrientMetric;
  });
  const selected = metrics.find((metric) => metric.key === selectedNutrient)!;

  return {
    period,
    loggedDays,
    dailyCalorieAverage: loggedDays
      ? (totals.get("Calories") ?? 0) / loggedDays
      : 0,
    metrics,
    selected,
    trend: buildNutrientTrend({
      period,
      start,
      end,
      events,
      byDay,
      byMeal,
      selectedNutrient,
      loggedDayKeys,
      timezone,
    }),
    sources: topSources(sources, selectedNutrient),
    insight: buildInsight(selected),
  };
}

function createAmountMap(): AmountMap {
  return new Map(QUERY_NUTRIENTS.map((nutrient) => [nutrient, 0]));
}

function asTrackedNutrient(value: string): NutrientKey | null {
  return QUERY_NUTRIENTS.find((nutrient) => nutrient === value) ?? null;
}

function getAmountMap(map: Map<string, AmountMap>, key: string) {
  const current = map.get(key) ?? createAmountMap();
  map.set(key, current);
  return current;
}

function addAmount(map: AmountMap, nutrient: NutrientKey, amount: number) {
  map.set(nutrient, (map.get(nutrient) ?? 0) + amount);
}

function deriveUnsaturated(map: AmountMap) {
  map.set(
    "Unsaturated fat",
    (map.get("Monounsaturated fat") ?? 0) +
      (map.get("Polyunsaturated fat") ?? 0),
  );
}

function addSource(
  sources: SourceMap,
  nutrient: NutrientKey,
  foodId: string,
  name: string,
  amount: number,
) {
  const foods = sources.get(nutrient) ?? new Map<string, NutrientSource>();
  const current = foods.get(foodId) ?? { foodId, name, amount: 0 };
  foods.set(foodId, { ...current, amount: current.amount + amount });
  sources.set(nutrient, foods);
}

function deriveUnsaturatedSources(sources: SourceMap) {
  const derived = new Map<string, NutrientSource>();
  for (const nutrient of ["Monounsaturated fat", "Polyunsaturated fat"] as const) {
    for (const source of sources.get(nutrient)?.values() ?? []) {
      const current = derived.get(source.foodId) ?? { ...source, amount: 0 };
      derived.set(source.foodId, {
        ...current,
        amount: current.amount + source.amount,
      });
    }
  }
  sources.set("Unsaturated fat", derived);
}

function topSources(sources: SourceMap, nutrient: NutrientKey) {
  return [...(sources.get(nutrient)?.values() ?? [])]
    .filter((source) => source.amount > 0)
    .toSorted((a, b) => b.amount - a.amount)
    .slice(0, 3);
}

function nutrientFocus(priorities: string[]) {
  const nutrients = new Set<NutrientKey>();
  if (priorities.includes("reduce_sodium")) nutrients.add("Sodium");
  if (priorities.includes("more_fibre")) nutrients.add("Fibre");
  if (priorities.includes("support_bones")) {
    nutrients.add("Calcium");
    nutrients.add("Vitamin D");
  }
  if (priorities.includes("support_energy")) {
    nutrients.add("Iron");
    nutrients.add("Vitamin B12");
  }
  return nutrients;
}

function buildInsight(metric: NutrientMetric) {
  if (metric.dailyAverage === 0) {
    return "Log a meal to start seeing this nutrient in context.";
  }
  if (metric.targetType === "limit") {
    return metric.progress <= 1
      ? "This is within your current daily guide."
      : "This period is above your current daily guide.";
  }
  if (metric.targetType === "reference") {
    return "Use this reference as context, not a score.";
  }
  return metric.progress >= 1
    ? "You’re meeting this guide on logged days."
    : "A little more on most days would meet your plan.";
}
