"use server";

import { ActionResult, runAction } from "@/lib/action";
import { revalidatePath } from "next/cache";
import {
  replaceMealRequest,
  saveMealRequest,
  type ReplaceMealRequest,
  type SaveMealRequest,
} from "./schemas";
import * as mealService from "./service";
import { isValid } from "date-fns";
import { Meal } from "@/db/food-schema";

export async function saveMeal(request: SaveMealRequest) {
  return runAction(async () => {
    const result = await mealService.saveMeal(saveMealRequest.parse(request));
    revalidateMealViews();
    return result;
  }, "Sorry, we could not save your meal.");
}

export async function replaceMeal(
  mealId: string,
  request: ReplaceMealRequest,
) {
  return runAction(async () => {
    const result = await mealService.replaceMeal(
      mealId,
      replaceMealRequest.parse(request),
    );
    revalidateMealViews();
    return result;
  }, "We could not update the meal.");
}

export async function deleteMeal(mealId: string) {
  return runAction(async () => {
    await mealService.deleteMeal(mealId);
    revalidateMealViews();
    return { mealId };
  }, "We could not delete the meal.");
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

function revalidateMealViews() {
  revalidatePath("/meals");
  revalidatePath("/dashboard");
}
