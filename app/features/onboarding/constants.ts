export const GOALS = ["lose", "maintain", "gain"] as const;
export const SEX_OPTIONS = ["female", "male", "intersex", "prefer_not_to_say"] as const;
export const ACTIVITY_LEVELS = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
] as const;

export const WEEKLY_CHANGE_OPTIONS = [0.25, 0.5, 1, 1.5, 2] as const;
export const PACE_WARNING_THRESHOLD_KG = 1;

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
} as const;

export const JOURNEY_FEELINGS = [
  "hopeful",
  "tired_of_starting_over",
  "unsure",
  "ready_for_change",
  "one_day_at_a_time",
] as const;

export const CHALLENGES = [
  "momentum",
  "stress",
  "time",
  "strict_plans",
  "uncertainty",
  "other",
] as const;
