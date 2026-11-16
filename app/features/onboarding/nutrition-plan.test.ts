import { describe, expect, it } from "vitest";
import { createOnboardingDraft } from "./draft";
import { calculateNutritionPlan } from "./nutrition-plan";
import { onboardingInputSchema } from "./schemas";

describe("nutrition plan", () => {
  it("accepts a requested change up to two kilograms per week", () => {
    const input = { ...createOnboardingDraft(), requestedWeeklyChangeKg: 2 };
    expect(onboardingInputSchema.safeParse(input).success).toBe(true);
    expect(calculateNutritionPlan(input).showsPaceWarning).toBe(true);
  });

  it("rejects weekly changes above the configured limit", () => {
    const input = { ...createOnboardingDraft(), requestedWeeklyChangeKg: 2.01 };
    expect(onboardingInputSchema.safeParse(input).success).toBe(false);
  });

  it("keeps aggressive requested deficits conservative", () => {
    const plan = calculateNutritionPlan(
      { ...createOnboardingDraft(), requestedWeeklyChangeKg: 2 },
      new Date("2026-11-16T12:00:00Z"),
    );
    expect(plan.plannedWeeklyChangeKg).toBe(1);
    expect(plan.dailyCalories).toBeGreaterThanOrEqual(1200);
  });

  it("caps generated gain adjustments at 500 calories per day", () => {
    const draft = createOnboardingDraft();
    const plan = calculateNutritionPlan({
      ...draft,
      goal: "gain",
      targetWeightKg: 90,
      requestedWeeklyChangeKg: 2,
    });
    expect(plan.plannedWeeklyChangeKg).toBe(0.45);
  });

  it("requires the target weight to match the goal direction", () => {
    const input = {
      ...createOnboardingDraft(),
      goal: "lose" as const,
      targetWeightKg: 90,
    };
    expect(onboardingInputSchema.safeParse(input).success).toBe(false);
  });
});
