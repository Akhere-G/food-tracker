import { pgTable, text, timestamp, date, numeric, boolean, jsonb, integer, index, primaryKey, unique, check } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const account = pgTable("account", {
	id: text().primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast()),
]);

export const food = pgTable("food", {
	id: text().primaryKey(),
	name: text().notNull(),
	externalId: text("external_id").notNull(),
	externalSource: text("external_source").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("external_id_external_source_unique").on(table.externalId, table.externalSource),]);

export const foodNutrient = pgTable("food_nutrient", {
	foodId: text("food_id").notNull().references(() => food.id, { onDelete: "restrict" } ),
	nutrientId: text("nutrient_id").notNull().references(() => nutrient.id, { onDelete: "cascade" } ),
	amountPer100g: numeric("amount_per_100g", { precision: 12, scale: 5 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	primaryKey({ columns: [table.foodId, table.nutrientId], name: "food_nutrient_pkey"}),
	index("food_nutrient_food_id_idx").using("btree", table.foodId.asc().nullsLast()),
	index("food_nutrient_nutrient_id_idx").using("btree", table.nutrientId.asc().nullsLast()),
check("food_nutrient_amount_nonnegative", sql`(amount_per_100g >= (0)::numeric)`),]);

export const meal = pgTable("meal", {
	id: text().primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	eatenAt: timestamp("eaten_at", { withTimezone: true }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("meal_user_eaten_at_idx").using("btree", table.userId.asc().nullsLast(), table.eatenAt.asc().nullsLast()),
]);

export const mealEntry = pgTable("meal_entry", {
	id: text().primaryKey(),
	mealId: text("meal_id").notNull().references(() => meal.id, { onDelete: "cascade" } ),
	foodId: text("food_id").notNull().references(() => food.id, { onDelete: "restrict" } ),
	amountInGrams: numeric("amount_in_grams", { precision: 12, scale: 5 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	servingId: text("serving_id").references(() => serving.id, { onDelete: "set null" } ),
	servingQuantity: numeric("serving_quantity", { precision: 12, scale: 5 }),
}, (table) => [
	index("meal_entry_meal_id").using("btree", table.mealId.asc().nullsLast()),
check("meal_entry_amount_positive", sql`(amount_in_grams > (0)::numeric)`),check("meal_entry_serving_quantity_positive", sql`((serving_quantity IS NULL) OR (serving_quantity > (0)::numeric))`),]);

export const nutrient = pgTable("nutrient", {
	id: text().primaryKey(),
	name: text().notNull(),
	unit: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("nutrient_name_key").on(table.name),]);

export const nutritionProfile = pgTable("nutrition_profile", {
	id: text().primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	dateOfBirth: date("date_of_birth").notNull(),
	sex: text().notNull(),
	genderIdentity: text("gender_identity"),
	heightCm: numeric("height_cm", { precision: 6, scale: 2 }).notNull(),
	currentWeightKg: numeric("current_weight_kg", { precision: 6, scale: 2 }).notNull(),
	targetWeightKg: numeric("target_weight_kg", { precision: 6, scale: 2 }).notNull(),
	goal: text().notNull(),
	activityLevel: text("activity_level").notNull(),
	journeyFeeling: text("journey_feeling").notNull(),
	biggestChallenge: text("biggest_challenge").notNull(),
	previousAttempts: jsonb("previous_attempts").default([]).notNull(),
	requestedWeeklyChangeKg: numeric("requested_weekly_change_kg", { precision: 4, scale: 2 }).notNull(),
	plannedWeeklyChangeKg: numeric("planned_weekly_change_kg", { precision: 4, scale: 2 }).notNull(),
	dailyCalories: integer("daily_calories").notNull(),
	dailyProteinGrams: integer("daily_protein_grams").notNull(),
	dailyCarbohydrateGrams: integer("daily_carbohydrate_grams").notNull(),
	dailyFatGrams: integer("daily_fat_grams").notNull(),
	targetDate: date("target_date"),
	timezone: text().notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true }).default(sql`now()`).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("nutrition_profile_user_idx").using("btree", table.userId.asc().nullsLast()),
	unique("nutrition_profile_user_unique").on(table.userId),check("nutrition_profile_weekly_change_range", sql`((requested_weekly_change_kg >= (0)::numeric) AND (requested_weekly_change_kg <= (2)::numeric))`),]);

export const serving = pgTable("serving", {
	id: text().primaryKey(),
	externalId: text("external_id").notNull(),
	foodId: text("food_id").notNull().references(() => food.id, { onDelete: "cascade" } ),
	label: text().notNull(),
	amountInGrams: numeric("amount_in_grams", { precision: 12, scale: 5 }).notNull(),
}, (table) => [
	unique("serving_external_id_food_id_unique").on(table.externalId, table.foodId),check("serving_amount_positive", sql`(amount_in_grams > (0)::numeric)`),]);

export const session = pgTable("session", {
	id: text().primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
}, (table) => [
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast()),
	unique("session_token_key").on(table.token),]);

export const user = pgTable("user", {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
	scheduledDeletionAt: timestamp("scheduled_deletion_at", { withTimezone: true }),
}, (table) => [
	unique("user_email_key").on(table.email),]);

export const userPreferences = pgTable("user_preferences", {
	id: text().primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	themeMode: text("theme_mode").default("system").notNull(),
	colorTheme: text("color_theme").default("cranberry").notNull(),
	weightUnit: text("weight_unit").default("kg").notNull(),
	heightUnit: text("height_unit").default("cm").notNull(),
	energyUnit: text("energy_unit").default("kcal").notNull(),
	mealReminders: boolean("meal_reminders").default(false).notNull(),
	dailyReminder: boolean("daily_reminder").default(false).notNull(),
	weeklySummary: boolean("weekly_summary").default(true).notNull(),
	goalMilestones: boolean("goal_milestones").default(true).notNull(),
	productUpdates: boolean("product_updates").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("user_preferences_user_unique").on(table.userId),]);

export const verification = pgTable("verification", {
	id: text().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast()),
]);
