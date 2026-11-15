import { BicepsFlexed, Flame, LucideIcon } from "lucide-react";

export const MACROS = {
  Calories: { name: "Calories", unit: "kcal", dailyMax: 2500 },
  Protein: { name: "Protein", unit: "g", dailyMax: 55 },
  "Total fat": { name: "Total fat", unit: "g", dailyMax: 78 },
  "Total carbohydrates": {
    name: "Total carbohydrates",
    unit: "g",
    dailyMax: 260,
  },
  "Total sugars": { name: "Total sugars", unit: "g", dailyMax: 90 },
} as const;

export const MacroShortSymbol: Record<string, string | React.ReactNode> = {
  Calories: <Flame size={14} />,
  Protein: "P",
  "Total fat": "F",
  "Total carbohydrates": "C",
  "Total sugars": "S",
};
export const SUBMACROS = {
  "Saturated fat": { name: "Saturated fat", unit: "g", dailyMax: 20 },
  "Monounsaturated fat": {
    name: "Monounsaturated fat",
    unit: "g",
    dailyMax: 40,
  },
  "Polyunsaturated fat": {
    name: "Polyunsaturated fat",
    unit: "g",
    dailyMax: 20,
  },
  "Unsaturated fat": {
    name: "Unsaturated fat",
    unit: "g",
    dailyMax: 60,
  }, // derived: mono + poly
  "Trans fat": { name: "Trans fat", unit: "g", dailyMax: 2 },
  Fibre: { name: "Fibre", unit: "g", dailyMax: 30 },
  "Added sugar": { name: "Added sugar", unit: "g", dailyMax: 30 },
} as const;

export const MINERALS = {
  Iron: { name: "Iron", unit: "mg", dailyMax: 14 },
  Calcium: { name: "Calcium", unit: "mg", dailyMax: 700 },
  Sodium: { name: "Sodium", unit: "mg", dailyMax: 2400 },
  Magnesium: { name: "Magnesium", unit: "mg", dailyMax: 300 },
  Potassium: { name: "Potassium", unit: "mg", dailyMax: 3500 },
} as const;

export const VITAMINS = {
  "Vitamin A": { name: "Vitamin A", unit: "µg", dailyMax: 700 }, // RAE
  "Vitamin C": { name: "Vitamin C", unit: "mg", dailyMax: 40 },
  "Vitamin D": { name: "Vitamin D", unit: "µg", dailyMax: 10 },
  "Vitamin B12": { name: "Vitamin B12", unit: "µg", dailyMax: 1.5 },
};

export const NUTRIENTS = {
  ...MACROS,
  ...MINERALS,
  ...VITAMINS,
  ...SUBMACROS,
} as const;

export type NutrientKey = keyof typeof NUTRIENTS;
