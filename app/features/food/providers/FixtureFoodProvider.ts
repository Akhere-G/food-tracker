import { NUTRIENTS, type NutrientKey } from "../nutrients";
import type { FoodImportData } from "../schemas";
import type { FoodSearchItem } from "@/integrations/all-nutrients/schema";
import { externalApiTypes } from "@/integrations/types";
import type { FoodApiProvider } from "./types";

const foods = [
  {
    search: {
      id: "fixture-chicken-soup",
      name: "Chicken soup",
      slug: "fixture-chicken-soup",
      groupName: "Prepared meals",
    },
    nutrients: {
      Calories: 120,
      Protein: 8,
      "Total fat": 4,
      "Saturated fat": 1.1,
      "Monounsaturated fat": 1.5,
      "Polyunsaturated fat": 0.8,
      "Unsaturated fat": 2.3,
      "Trans fat": 0,
      "Total carbohydrates": 15,
      Fibre: 1.5,
      "Total sugars": 3,
      "Added sugar": 0,
      Iron: 1.2,
      Calcium: 35,
      Sodium: 420,
      Magnesium: 18,
      Potassium: 260,
      "Vitamin A": 90,
      "Vitamin C": 4,
      "Vitamin D": 0.3,
      "Vitamin B12": 0.4,
    } satisfies Record<NutrientKey, number>,
  },
] as const;

export class FixtureFoodProvider implements FoodApiProvider {
  async searchFoods(query: string): Promise<FoodSearchItem[]> {
    const normalizedQuery = query.trim().toLowerCase();
    return foods
      .filter(({ search }) => search.name.toLowerCase().includes(normalizedQuery))
      .map(({ search }) => search);
  }

  async getFoodDetails(externalId: string): Promise<FoodImportData> {
    const fixture = foods.find(({ search }) => search.slug === externalId);
    if (!fixture) throw new Error(`Unknown fixture food: ${externalId}`);

    return {
      food: {
        name: fixture.search.name,
        externalId: fixture.search.slug,
        externalSource: externalApiTypes.allthenutrients,
      },
      nutrients: Object.entries(fixture.nutrients).map(
        ([name, amountPer100g]) => ({
          amountPer100g: String(amountPer100g),
          nutrient: { ...NUTRIENTS[name as NutrientKey] },
        }),
      ),
      servings: [
        {
          externalId: "fixture-bowl",
          label: "1 bowl, 300 g",
          amountInGrams: "300",
        },
      ],
    };
  }
}
