import {
  MINERALS,
  SUBMACROS,
  VITAMINS,
  type NutrientKey,
} from "@/app/features/food/nutrients";

export const NUTRIENT_SECTIONS = [
  { key: "submacros", label: "Submacros", nutrients: nutrientKeys(SUBMACROS) },
  { key: "minerals", label: "Minerals", nutrients: nutrientKeys(MINERALS) },
  { key: "vitamins", label: "Vitamins", nutrients: nutrientKeys(VITAMINS) },
] as const satisfies readonly {
  key: string;
  label: string;
  nutrients: readonly NutrientKey[];
}[];

export const TRACKED_NUTRIENTS: NutrientKey[] = NUTRIENT_SECTIONS.flatMap(
  (section) => section.nutrients,
);

export const QUERY_NUTRIENTS: NutrientKey[] = [
  ...TRACKED_NUTRIENTS,
  "Calories",
];

export const DEFAULT_NUTRIENT: NutrientKey = "Fibre";

export function parseSelectedNutrient(value?: string): NutrientKey | null {
  return TRACKED_NUTRIENTS.find((nutrient) => nutrient === value) ?? null;
}

function nutrientKeys<T extends Partial<Record<NutrientKey, unknown>>>(
  nutrients: T,
) {
  return Object.keys(nutrients) as (keyof T & NutrientKey)[];
}
