import { describe, expect, it } from "vitest";
import { isValidDateInput, isValidTimeInput } from "./date-input";

describe("date input validation", () => {
  it.each(["2026-11-16", "2024-02-29"])(
    "accepts the valid date %s",
    (value) => {
      expect(isValidDateInput(value)).toBe(true);
    },
  );

  it.each(["2026-02-29", "2026-13-01", "16-11-2026", "", undefined])(
    "rejects the invalid date %s",
    (value) => {
      expect(isValidDateInput(value)).toBe(false);
    },
  );

  it.each(["00:00", "18:30", "23:59"])(
    "accepts the valid time %s",
    (value) => {
      expect(isValidTimeInput(value)).toBe(true);
    },
  );

  it.each(["24:00", "12:60", "6:30", "", undefined])(
    "rejects the invalid time %s",
    (value) => {
      expect(isValidTimeInput(value)).toBe(false);
    },
  );
});
