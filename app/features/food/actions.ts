"use server";

import { ActionResult, runAction } from "@/lib/action";
import { externalFoodRef, searchQuery } from "./schemas";
import * as foodService from "./service";
import { FoodSearchItem } from "@/integrations/all-nutrients/schema";

export async function searchFoods(
  query: string,
): Promise<ActionResult<FoodSearchItem[]>> {
  return runAction(
    async () => foodService.searchFoods(searchQuery.parse(query)),
    "Could not search foods. Please try again.",
  );
}

export async function getFoodDetails(externalId: string) {
  return runAction(
    async () =>
      foodService.getFoodDetails(
        externalFoodRef.shape.externalId.parse(externalId),
      ),
    "Could not load food details. Please try again.",
  );
}
