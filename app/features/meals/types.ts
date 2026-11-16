import { FoodImportData } from "../food/schemas";
import { MealEntryInput } from "./schemas";

export interface MealEntryData {
  mealEntryInput: MealEntryInput;
  foodImportData: FoodImportData;
}
