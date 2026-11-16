import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOnboardingDraft } from "./draft";

const repository = vi.hoisted(() => ({
  upsertNutritionProfile: vi.fn(async (values: unknown) => values),
}));

vi.mock("./repository", () => repository);

import { saveOnboardingProfile } from "./service";

describe("onboarding profile persistence", () => {
  beforeEach(() => repository.upsertNutritionProfile.mockClear());

  it("persists a planned weekly pace of two kilograms", async () => {
    await saveOnboardingProfile("user-1", {
      ...createOnboardingDraft(),
      requestedWeeklyChangeKg: 2,
    });

    expect(repository.upsertNutritionProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        requestedWeeklyChangeKg: "2",
        plannedWeeklyChangeKg: "2",
      }),
    );
  });
});
