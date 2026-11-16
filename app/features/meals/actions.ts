"use server";

import { ActionResult, runAction } from "@/lib/action";
import { saveMealRequest, SaveMealRequest } from "./schemas";
import * as mealService from "./service";
import { isValid } from "date-fns";
import { Meal } from "@/db/food-schema";

export async function saveMeal(request: SaveMealRequest) {
  return runAction(
    async () => mealService.saveMeal(saveMealRequest.parse(request)),
    "Sorry.. Could not save your meal. Something went wrong.",
  );
}

export async function getMeal(mealId: string) {
  return runAction(
    async () => mealService.getMeal(mealId),
    "Sorry, we could not load that meal.",
  );
}

export async function getMeals({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}): Promise<ActionResult<Meal[]>> {
  if (!isValid(startDate) || !isValid(endDate)) {
    return {
      success: false,
      code: "validation",
      error: "Invalid date",
    };
  }

  return runAction(
    async () => mealService.getMeals({ startDate, endDate }),
    "Sorry.. Could not get your meals. Something went wrong.",
  );
}
