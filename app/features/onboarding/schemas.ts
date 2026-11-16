import * as z from "zod";
import {
  ACTIVITY_LEVELS,
  CHALLENGES,
  GOALS,
  JOURNEY_FEELINGS,
  SEX_OPTIONS,
} from "./constants";

export const onboardingInputSchema = z
  .object({
    dateOfBirth: z.iso.date(),
    sex: z.enum(SEX_OPTIONS),
    genderIdentity: z.string().trim().max(80).nullable(),
    heightCm: z.number().min(120).max(230),
    currentWeightKg: z.number().min(35).max(350),
    targetWeightKg: z.number().min(35).max(350),
    goal: z.enum(GOALS),
    activityLevel: z.enum(ACTIVITY_LEVELS),
    journeyFeeling: z.enum(JOURNEY_FEELINGS),
    biggestChallenge: z.enum(CHALLENGES),
    previousAttempts: z.array(z.string().trim().min(1).max(80)).max(8),
    requestedWeeklyChangeKg: z.number().min(0).max(2),
    timezone: z.string().trim().min(1).max(100),
  })
  .superRefine((value, context) => {
    if (value.goal === "maintain" && value.requestedWeeklyChangeKg !== 0) {
      context.addIssue({
        code: "custom",
        path: ["requestedWeeklyChangeKg"],
        message: "Maintenance goals must use a zero weekly change.",
      });
    }
    if (value.goal === "lose" && value.targetWeightKg >= value.currentWeightKg) {
      context.addIssue({
        code: "custom",
        path: ["targetWeightKg"],
        message: "A weight-loss target must be below your current weight.",
      });
    }
    if (value.goal === "gain" && value.targetWeightKg <= value.currentWeightKg) {
      context.addIssue({
        code: "custom",
        path: ["targetWeightKg"],
        message: "A weight-gain target must be above your current weight.",
      });
    }
  });

export type OnboardingInput = z.infer<typeof onboardingInputSchema>;

export const preferencesInputSchema = z.object({
  themeMode: z.enum(["light", "dark", "system"]),
  colorTheme: z.enum(["cranberry", "ocean", "forest", "amber", "plum"]),
  weightUnit: z.enum(["kg", "lb"]),
  heightUnit: z.enum(["cm", "ft-in"]),
  energyUnit: z.enum(["kcal", "kj"]),
  mealReminders: z.boolean(),
  dailyReminder: z.boolean(),
  weeklySummary: z.boolean(),
  goalMilestones: z.boolean(),
  productUpdates: z.boolean(),
});

export type PreferencesInput = z.infer<typeof preferencesInputSchema>;
