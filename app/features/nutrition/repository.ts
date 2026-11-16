import { and, eq, gte, inArray, lt } from "drizzle-orm";
import { db } from "@/db";
import {
  food,
  foodNutrient,
  meal,
  mealEntry,
  nutrient,
} from "@/db/food-schema";
import type { NutrientKey } from "@/app/features/food/nutrients";

type NutritionRangeQuery = {
  userId: string;
  start: Date;
  end: Date;
};

export async function findMealEvents({ userId, start, end }: NutritionRangeQuery) {
  return db
    .select({ mealId: meal.id, eatenAt: meal.eatenAt })
    .from(meal)
    .where(
      and(eq(meal.userId, userId), gte(meal.eatenAt, start), lt(meal.eatenAt, end)),
    );
}

export async function findNutrientIntakeRows(
  { userId, start, end }: NutritionRangeQuery,
  nutrientNames: NutrientKey[],
) {
  return db
    .select({
      mealId: meal.id,
      eatenAt: meal.eatenAt,
      foodId: food.id,
      foodName: food.name,
      amountInGrams: mealEntry.amountInGrams,
      amountPer100g: foodNutrient.amountPer100g,
      nutrientName: nutrient.name,
    })
    .from(meal)
    .innerJoin(mealEntry, eq(mealEntry.mealId, meal.id))
    .innerJoin(food, eq(food.id, mealEntry.foodId))
    .innerJoin(foodNutrient, eq(foodNutrient.foodId, food.id))
    .innerJoin(nutrient, eq(nutrient.id, foodNutrient.nutrientId))
    .where(
      and(
        eq(meal.userId, userId),
        gte(meal.eatenAt, start),
        lt(meal.eatenAt, end),
        inArray(nutrient.name, nutrientNames),
      ),
    );
}

export type MealEvent = Awaited<ReturnType<typeof findMealEvents>>[number];
export type NutrientIntakeRow = Awaited<
  ReturnType<typeof findNutrientIntakeRows>
>[number];
