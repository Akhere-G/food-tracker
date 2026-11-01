"use server";

import { runAction } from "@/lib/action";
import { externalFoodRef, searchQuery } from "./schemas";
import * as foodService from "./service";

export async function searchFoods(query: string) {
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
