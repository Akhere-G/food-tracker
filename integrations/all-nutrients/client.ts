import { foodSearchItem, foodDetailResponse } from "./schema";

const BASE_URL = "https://allthenutrients.com";

export async function searchFoods(q: string) {
  const params = new URLSearchParams({
    q,
    locale: "en",
  });

  const response = await fetch(`${BASE_URL}/api/autocomplete?${params}`);

  if (!response.ok) {
    throw new Error(`Food search failed: ${response.status}`);
  }

  return foodSearchItem.array().parse(await response.json());
}

export async function getFoodDetails(foodId: string) {
  const response = await fetch(
    `${BASE_URL}/api/v1/foods/${encodeURIComponent(foodId)}.json`,
  );

  if (!response.ok) {
    throw new Error(`Fetching food details failed: ${response.status}`);
  }

  return foodDetailResponse.parse(await response.json());
}
