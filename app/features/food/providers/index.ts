import { externalApiTypes, ExternalApiTypes } from "@/integrations/types";
import { AllTheNutrientsProvider } from "./AllTheNutrientsProvider";
import type { FoodApiProvider } from "./types";

export type { FoodApiProvider } from "./types";

export function FoodApiProviderFactory(
  factoryName: ExternalApiTypes,
): FoodApiProvider {
  switch (factoryName) {
    case externalApiTypes.allthenutrients:
      return new AllTheNutrientsProvider();
  }
}
