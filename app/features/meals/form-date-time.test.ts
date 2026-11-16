import { describe, expect, it } from "vitest";
import { resolveMealFormDateTime } from "./form-date-time";

const fallback = new Date(2026, 10, 16, 11, 45);

describe("resolveMealFormDateTime", () => {
  it("preserves valid query values", () => {
    expect(
      resolveMealFormDateTime(
        { date: "2026-12-24", time: "18:30" },
        fallback,
      ),
    ).toEqual({ initialDate: "2026-12-24", initialTime: "18:30" });
  });

  it("falls back when query values are invalid", () => {
    expect(
      resolveMealFormDateTime(
        { date: "2026-02-29", time: "24:00" },
        fallback,
      ),
    ).toEqual({ initialDate: "2026-11-16", initialTime: "11:45" });
  });

  it("rejects repeated query parameters", () => {
    expect(
      resolveMealFormDateTime(
        { date: ["2026-12-24"], time: ["18:30"] },
        fallback,
      ),
    ).toEqual({ initialDate: "2026-11-16", initialTime: "11:45" });
  });
});
