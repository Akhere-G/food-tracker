import { describe, expect, it } from "vitest";
import { createMealRequest } from "./meal-request";

describe("createMealRequest", () => {
  it("creates an offset-aware timestamp in the user's timezone", () => {
    const request = createMealRequest({
      date: "2026-07-10",
      time: "18:30",
      timezone: "Europe/London",
      entries: [],
    });

    expect(request.eatenAt).toBe("2026-07-10T18:30:00.000+01:00");
  });

  it("rejects empty date and time values", () => {
    expect(() =>
      createMealRequest({
        date: "",
        time: "",
        timezone: "Europe/London",
        entries: [],
      }),
    ).toThrow("Choose a valid date and time.");
  });
});
