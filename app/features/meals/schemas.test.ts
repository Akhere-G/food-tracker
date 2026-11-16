import { describe, expect, it } from "vitest";
import { TZDate } from "@date-fns/tz";
import { saveMealRequest } from "./schemas";

const mealEntry = {
  food: { externalId: "food-1", externalSource: "test" },
  serving: null,
  servingQuantity: null,
  amountInGrams: 100,
};

describe("meal request schema", () => {
  it("accepts ISO datetimes with a timezone offset", () => {
    const eatenAt = new TZDate(
      2026,
      10,
      16,
      12,
      30,
      "Europe/London",
    ).toISOString();
    const result = saveMealRequest.safeParse({
      eatenAt,
      mealEntries: [mealEntry],
    });

    expect(result.success).toBe(true);
  });

  it("rejects datetimes without a timezone", () => {
    const result = saveMealRequest.safeParse({
      eatenAt: "2026-11-16T12:30:00",
      mealEntries: [mealEntry],
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate foods from the same external source", () => {
    const result = saveMealRequest.safeParse({
      mealEntries: [mealEntry, { ...mealEntry, amountInGrams: 200 }],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Each food can only appear once in a meal",
    );
  });

  it("allows matching external IDs from different sources", () => {
    const result = saveMealRequest.safeParse({
      mealEntries: [
        mealEntry,
        {
          ...mealEntry,
          food: { externalId: "food-1", externalSource: "other" },
        },
      ],
    });

    expect(result.success).toBe(true);
  });
});
