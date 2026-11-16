import { describe, expect, it } from "vitest";
import { nutritionPeriodRange, parseNutritionPeriod } from "./period";

describe("nutrition periods", () => {
  it("uses Monday as the first day of a selected week", () => {
    const range = nutritionPeriodRange(
      "week",
      "Europe/London",
      "2026-11-18",
    );

    expect(range.anchor).toBe("2026-11-16");
    expect(range.label).toBe("16–22 November 2026");
    expect(range.previous).toBe("2026-11-09");
    expect(range.next).toBe("2026-11-23");
    expect(range.pickerValue).toBe("2026-W47");
    expect(range.end.getTime() - range.start.getTime()).toBe(
      7 * 24 * 60 * 60 * 1000,
    );
  });

  it("supports day, month and year selection", () => {
    expect(
      nutritionPeriodRange("day", "Europe/London", "2026-11-16").label,
    ).toBe("Monday, 16 November 2026");
    expect(
      nutritionPeriodRange("day", "Europe/London", "2026-11-16").end
        .toISOString(),
    ).toContain("2026-11-17");
    expect(
      nutritionPeriodRange("month", "Europe/London", "2026-11-16")
        .pickerValue,
    ).toBe("2026-11");
    expect(
      nutritionPeriodRange("year", "Europe/London", "2026-11-16")
        .pickerValue,
    ).toBe("2026");
  });

  it("falls back to the weekly view", () => {
    expect(parseNutritionPeriod("quarter")).toBe("week");
  });
});
