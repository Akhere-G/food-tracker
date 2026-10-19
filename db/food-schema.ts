import { defineRelations, sql } from "drizzle-orm";
import { user } from "@/db/auth-schema";
import {
  pgTable,
  text,
  timestamp,
  unique,
  index,
  primaryKey,
  numeric,
  check,
} from "drizzle-orm/pg-core";

export const food = pgTable(
  "food",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    externalId: text("external_id").notNull(),
    externalSource: text("external_source").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => /* @__PURE__ */ new Date()),
  },
  (table) => [
    unique("external_id_external_source_unique").on(
      table.externalId,
      table.externalSource,
    ),
  ],
);

export const nutrient = pgTable("nutrient", {
  id: text().primaryKey(),
  name: text().notNull().unique(),
  unit: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
});

export const foodNutrient = pgTable(
  "food_nutrient",
  {
    foodId: text("food_id")
      .notNull()
      .references(() => food.id, { onDelete: "restrict" }),
    nutrientId: text("nutrient_id")
      .notNull()
      .references(() => nutrient.id, {
        onDelete: "cascade",
      }),
    amountPer100g: numeric("amount_per_100g", {
      precision: 12,
      scale: 5,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => /* @__PURE__ */ new Date()),
  },
  (table) => [
    primaryKey({ columns: [table.foodId, table.nutrientId] }),
    index("food_nutrient_food_id_idx").on(table.foodId),
    index("food_nutrient_nutrient_id_idx").on(table.nutrientId),
    check("food_nutrient_amount_nonnegative", sql`${table.amountPer100g} >= 0`),
  ],
);

export const meal = pgTable(
  "meal",
  {
    id: text().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    eatenAt: timestamp("eaten_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => /* @__PURE__ */ new Date()),
  },
  (table) => [index("meal_user_eaten_at_idx").on(table.userId, table.eatenAt)],
);

export const mealEntry = pgTable(
  "meal_entry",
  {
    id: text().primaryKey(),
    mealId: text("meal_id")
      .notNull()
      .references(() => meal.id, { onDelete: "cascade" }),
    foodId: text("food_id")
      .notNull()
      .references(() => food.id, { onDelete: "cascade" }),
    amountInGrams: numeric("amount_in_grams", {
      precision: 12,
      scale: 5,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => /* @__PURE__ */ new Date()),
  },
  (table) => [
    check("meal_entry_amount_positive", sql`${table.amountInGrams} > 0`),
  ],
);

export const foodRelations = defineRelations(
  { food, nutrient, foodNutrient, meal, user, mealEntry },
  (r) => ({
    food: {
      nutrients: r.many.foodNutrient({
        from: r.food.id,
        to: r.foodNutrient.foodId,
      }),
    },
    nutrient: {
      foods: r.many.foodNutrient({
        from: r.nutrient.id,
        to: r.foodNutrient.nutrientId,
      }),
    },
    foodNutrient: {
      food: r.one.food({
        from: r.foodNutrient.foodId,
        to: r.food.id,
      }),
      nutrient: r.one.nutrient({
        from: r.foodNutrient.nutrientId,
        to: r.nutrient.id,
      }),
    },
    meal: {
      user: r.one.user({
        from: r.meal.userId,
        to: r.user.id,
      }),
      entries: r.many.mealEntry({
        from: r.meal.id,
        to: r.mealEntry.mealId,
      }),
    },
    user: {
      meals: r.many.meal({
        from: r.user.id,
        to: r.meal.userId,
      }),
    },
    mealEntry: {
      meal: r.one.meal({
        from: r.mealEntry.mealId,
        to: r.meal.id,
      }),
      food: r.one.food({
        from: r.mealEntry.foodId,
        to: r.food.id,
      }),
    },
  }),
);
