import { FoodSearchItem } from "@/integrations/all-nutrients/schema";
import { FoodImportData } from "../schemas";
import { externalApiTypes, ExternalApiTypes } from "@/integrations/types";
import { AllTheNutrientsProvider } from "./AllTheNutrientsProvider";

export interface FoodApiProvider {
  searchFoods(query: string): Promise<FoodSearchItem[]>;
  getFoodDetails(slug: string): Promise<FoodImportData>;
}

export function ProviderFactory(
  factoryName: ExternalApiTypes,
): FoodApiProvider {
  switch (factoryName) {
    case externalApiTypes.allthenutrients:
      return new AllTheNutrientsProvider();
  }
}
