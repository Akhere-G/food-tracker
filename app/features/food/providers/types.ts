import { FoodSearchItem } from "@/integrations/all-nutrients/schema";
import { FoodImportData } from "../schemas";

export interface FoodApiProvider {
  searchFoods(query: string): Promise<FoodSearchItem[]>;
  getFoodDetails(externalId: string): Promise<FoodImportData>;
}
