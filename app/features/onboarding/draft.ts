import type { OnboardingInput } from "./schemas";
import { onboardingInputSchema } from "./schemas";

export const ONBOARDING_STORAGE_KEY = "foodtracker:onboarding:v1";

export function createOnboardingDraft(): OnboardingInput {
  return {
    dateOfBirth: "1994-01-01",
    sex: "prefer_not_to_say",
    genderIdentity: null,
    heightCm: 170,
    currentWeightKg: 82.4,
    targetWeightKg: 79,
    goal: "lose",
    activityLevel: "moderate",
    journeyFeeling: "one_day_at_a_time",
    biggestChallenge: "momentum",
    previousAttempts: [],
    requestedWeeklyChangeKg: 0.5,
    timezone: "Europe/London",
  };
}

export function parseOnboardingDraft(value: string | null) {
  if (!value) return null;
  try {
    const parsed = onboardingInputSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
