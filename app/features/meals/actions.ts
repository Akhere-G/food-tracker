"use server";

import { runAction } from "@/lib/action";
import { saveMealRequest, SaveMealRequest } from "./schemas";
import * as mealService from "./service";

export async function saveMeal(request: SaveMealRequest) {
  return runAction(
    async () => mealService.saveMeal(saveMealRequest.parse(request)),
    "Sorry.. Could not save your meal. Something went wrong.",
  );
}
