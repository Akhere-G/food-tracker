import * as api from "@/integrations/all-nutrients/client";
import { FoodImportData } from "../schemas";
import { FoodApiProvider } from "./types";
import { FoodSearchItem } from "@/integrations/all-nutrients/schema";
import { MapApiToFoodDetail } from "@/integrations/all-nutrients/mapper";

export class AllTheNutrientsProvider implements FoodApiProvider {
  async searchFoods(query: string): Promise<FoodSearchItem[]> {
    return await api.searchFoods(query);
  }

  async getFoodDetails(slug: string): Promise<FoodImportData> {
    const result = await api.getFoodDetails(slug);
    return MapApiToFoodDetail(result);
  }
}
