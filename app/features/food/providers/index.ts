import { externalApiTypes, ExternalApiTypes } from "@/integrations/types";
import { AllTheNutrientsProvider } from "./AllTheNutrientsProvider";
import { FixtureFoodProvider } from "./FixtureFoodProvider";
import type { FoodApiProvider } from "./types";

export type { FoodApiProvider } from "./types";

export function FoodApiProviderFactory(
  factoryName: ExternalApiTypes,
): FoodApiProvider {
  if (process.env.E2E_FIXTURES === "true") {
    return new FixtureFoodProvider();
  }

  switch (factoryName) {
    case externalApiTypes.allthenutrients:
      return new AllTheNutrientsProvider();
  }
}
