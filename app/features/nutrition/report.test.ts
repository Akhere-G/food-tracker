import { describe, expect, it } from "vitest";
import type { NutritionProfile } from "@/db/profile-schema";
import { nutritionPeriodRange } from "./period";
import { buildNutritionReport } from "./report";
import type { MealEvent, NutrientIntakeRow } from "./repository";

const profile = {
  dateOfBirth: "1994-01-01",
  sex: "female",
  dailyCalories: 2000,
  dailyProteinGrams: 120,
  dailyFatGrams: 60,
  dailyCarbohydrateGrams: 240,
  timezone: "Europe/London",
  nutritionPriorities: ["more_fibre"],
} as NutritionProfile;

function row(
  day: number,
  nutrientName: string,
  amountPer100g: number,
  foodId = "porridge",
  foodName = "Porridge",
): NutrientIntakeRow {
  return {
    mealId: `meal-${day}`,
    eatenAt: new Date(`2026-11-${day}T08:00:00Z`),
    foodId,
    foodName,
    amountInGrams: "100",
    amountPer100g: String(amountPer100g),
    nutrientName,
  };
}

describe("nutrition report", () => {
  it("averages logged days, derives unsaturated fat and ranks sources", () => {
    const range = nutritionPeriodRange("week", profile.timezone, "2026-11-16");
    const events: MealEvent[] = [16, 17, 18, 19, 20].map((day) => ({
      mealId: `meal-${day}`,
      eatenAt: new Date(`2026-11-${day}T08:00:00Z`),
    }));
    const rows = events.flatMap((_, index) => {
      const day = 16 + index;
      return [
        row(day, "Calories", 100),
        row(day, "Fibre", 5),
        row(day, "Monounsaturated fat", 2),
        row(day, "Polyunsaturated fat", 1),
      ];
    });
    rows.push(row(16, "Fibre", 2, "apple", "Apple"));

    const report = buildNutritionReport({
      events,
      rows,
      profile,
      period: "week",
      start: range.start,
      end: range.end,
      selectedNutrient: "Fibre",
    });

    expect(report.loggedDays).toBe(5);
    expect(report.dailyCalorieAverage).toBe(100);
    expect(report.selected.dailyAverage).toBeCloseTo(5.4);
    expect(report.metrics.find((metric) => metric.key === "Unsaturated fat")?.dailyAverage).toBe(3);
    expect(report.metrics.find((metric) => metric.key === "Vitamin D")?.dailyAverage).toBe(0);
    expect(report.sources.map((source) => source.name)).toEqual([
      "Porridge",
      "Apple",
    ]);
    expect(report.trend).toHaveLength(7);
    expect(report.trend.at(-1)).toMatchObject({ amount: 0, logged: false });
  });

  it("returns explicit zero values for an empty period", () => {
    const range = nutritionPeriodRange("month", profile.timezone, "2026-11-16");
    const report = buildNutritionReport({
      events: [],
      rows: [],
      profile,
      period: "month",
      start: range.start,
      end: range.end,
      selectedNutrient: "Vitamin D",
    });

    expect(report.loggedDays).toBe(0);
    expect(report.selected.dailyAverage).toBe(0);
    expect(report.sources).toEqual([]);
    expect(report.insight).toContain("Log a meal");
  });
});
