import { user } from "@/db/auth-schema";
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const nutritionProfile = pgTable(
  "nutrition_profile",
  {
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    dateOfBirth: date("date_of_birth").notNull(),
    sex: text().notNull(),
    genderIdentity: text("gender_identity"),
    heightCm: numeric("height_cm", { precision: 6, scale: 2 }).notNull(),
    currentWeightKg: numeric("current_weight_kg", {
      precision: 6,
      scale: 2,
    }).notNull(),
    targetWeightKg: numeric("target_weight_kg", {
      precision: 6,
      scale: 2,
    }).notNull(),
    goal: text().notNull(),
    activityLevel: text("activity_level").notNull(),
    journeyFeeling: text("journey_feeling").notNull(),
    biggestChallenge: text("biggest_challenge").notNull(),
    previousAttempts: jsonb("previous_attempts")
      .$type<string[]>()
      .notNull()
      .default([]),
    requestedWeeklyChangeKg: numeric("requested_weekly_change_kg", {
      precision: 4,
      scale: 2,
    }).notNull(),
    plannedWeeklyChangeKg: numeric("planned_weekly_change_kg", {
      precision: 4,
      scale: 2,
    }).notNull(),
    dailyCalories: integer("daily_calories").notNull(),
    dailyProteinGrams: integer("daily_protein_grams").notNull(),
    dailyCarbohydrateGrams: integer("daily_carbohydrate_grams").notNull(),
    dailyFatGrams: integer("daily_fat_grams").notNull(),
    targetDate: date("target_date"),
    timezone: text().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique("nutrition_profile_user_unique").on(table.userId),
    index("nutrition_profile_user_idx").on(table.userId),
    check(
      "nutrition_profile_weekly_change_range",
      sql`${table.requestedWeeklyChangeKg} >= 0 AND ${table.requestedWeeklyChangeKg} <= 2`,
    ),
  ],
);

export const userPreferences = pgTable(
  "user_preferences",
  {
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    themeMode: text("theme_mode").notNull().default("system"),
    colorTheme: text("color_theme").notNull().default("cranberry"),
    weightUnit: text("weight_unit").notNull().default("kg"),
    heightUnit: text("height_unit").notNull().default("cm"),
    energyUnit: text("energy_unit").notNull().default("kcal"),
    mealReminders: boolean("meal_reminders").notNull().default(false),
    dailyReminder: boolean("daily_reminder").notNull().default(false),
    weeklySummary: boolean("weekly_summary").notNull().default(true),
    goalMilestones: boolean("goal_milestones").notNull().default(true),
    productUpdates: boolean("product_updates").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique("user_preferences_user_unique").on(table.userId)],
);

export type NutritionProfile = typeof nutritionProfile.$inferSelect;
export type NewNutritionProfile = typeof nutritionProfile.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
