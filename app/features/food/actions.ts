"use server";

import { ZodError } from "zod";
import { ActionResult } from "./result";
import {
  externalFoodRef,
  FoodImportData,
  saveMealRequest,
  SaveMealRequest,
  searchQuery,
} from "./schemas";
import * as foodService from "./service";
import { FoodSearchItem } from "@/integrations/all-nutrients/schema";

function toError(
  err: unknown,
  fallback: string = "Something went wrong...",
): { success: false; error: string } {
  if (err instanceof ZodError) {
    return {
      success: false,
      error: err.issues[0]?.message ?? fallback,
    };
  }
  if (err instanceof foodService.FoodServiceError) {
    return { success: false, error: err.message };
  }
  return { success: false, error: fallback };
}

export async function searchFoods(
  query: string,
): Promise<ActionResult<FoodSearchItem[]>> {
  try {
    const data = await foodService.searchFoods(searchQuery.parse(query));
    return { success: true, data };
  } catch (err) {
    return toError(err, "Could not search foods. Please try again.");
  }
}

export async function getFoodDetails(
  externalId: string,
): Promise<ActionResult<FoodImportData>> {
  try {
    const id = externalFoodRef.shape.externalId.parse(externalId);
    return { success: true, data: await foodService.getFoodDetails(id) };
  } catch (err) {
    return toError(err, "Could not load food details. Please try again.");
  }
}

export async function saveMeal(
  request: SaveMealRequest,
): Promise<ActionResult<{ mealId: string }>> {
  try {
    const parsed = saveMealRequest.parse(request);
    return { success: true, data: await foodService.saveMeal(parsed) };
  } catch (err) {
    return toError(
      err,
      "Sorry.. Could not save your meal. Something went wrong.",
    );
  }
}
