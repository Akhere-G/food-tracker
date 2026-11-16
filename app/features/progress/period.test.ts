import { describe, expect, it } from "vitest";
import { format } from "date-fns";
import { dayRange, periodRange } from "./period";

describe("period ranges", () => {
  it("starts each week on Monday", () => {
    const range = periodRange("week", "Europe/London", "2026-11-19");
    expect(format(range.start, "yyyy-MM-dd")).toBe("2026-11-16");
    expect(format(range.end, "yyyy-MM-dd")).toBe("2026-11-23");
  });

  it("uses the profile timezone for day boundaries", () => {
    const range = dayRange("America/New_York", "2026-03-08");
    expect(new Date(range.start.getTime()).toISOString()).toBe(
      "2026-03-08T05:00:00.000Z",
    );
    expect(new Date(range.end.getTime()).toISOString()).toBe(
      "2026-03-09T04:00:00.000Z",
    );
  });

  it("builds complete calendar years", () => {
    const range = periodRange("year", "Europe/London", "2026-06-01");
    expect(format(range.start, "yyyy-MM-dd")).toBe("2026-01-01");
    expect(format(range.end, "yyyy-MM-dd")).toBe("2027-01-01");
  });

  it("falls back safely when URL date state is invalid", () => {
    const range = dayRange("Europe/London", "not-a-date");
    expect(Number.isNaN(range.start.getTime())).toBe(false);
  });
});
