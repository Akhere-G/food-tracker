export const NUTRIENTS = {
  calories: { name: "Calories", unit: "kcal" },
  protein: { name: "Protein", unit: "g" },
  totalFat: { name: "Total fat", unit: "g" },
  saturatedFat: { name: "Saturated fat", unit: "g" },
  monounsaturatedFat: { name: "Monounsaturated fat", unit: "g" },
  polyunsaturatedFat: { name: "Polyunsaturated fat", unit: "g" },
  unsaturatedFat: { name: "Unsaturated fat", unit: "g" }, // derived: mono + poly
  transFat: { name: "Trans fat", unit: "g" },
  totalCarbs: { name: "Total carbohydrates", unit: "g" },
  fibre: { name: "Fibre", unit: "g" },
  totalSugars: { name: "Total sugars", unit: "g" },
  addedSugar: { name: "Added sugar", unit: "g" },
  iron: { name: "Iron", unit: "mg" },
  calcium: { name: "Calcium", unit: "mg" },
  sodium: { name: "Sodium", unit: "mg" },
  magnesium: { name: "Magnesium", unit: "mg" },
  potassium: { name: "Potassium", unit: "mg" },
  vitaminA: { name: "Vitamin A", unit: "µg" }, // RAE
  vitaminC: { name: "Vitamin C", unit: "mg" },
  vitaminD: { name: "Vitamin D", unit: "µg" },
  vitaminB12: { name: "Vitamin B12", unit: "µg" },
} as const;

export type NutrientKey = keyof typeof NUTRIENTS;
