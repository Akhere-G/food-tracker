import type { NutrientKey } from "@/app/features/food/nutrients";
import type { TargetType } from "./guidance";
import type { NutritionPeriod } from "./period";

export type NutrientMetric = {
  key: NutrientKey;
  name: string;
  unit: string;
  periodTotal: number;
  dailyAverage: number;
  dailyTarget: number;
  targetType: TargetType;
  progress: number;
  focused: boolean;
  derived: boolean;
};

export type NutrientTrendItem = {
  key: string;
  label: string;
  sublabel: string;
  amount: number;
  logged: boolean;
};

export type NutrientSource = {
  foodId: string;
  name: string;
  amount: number;
};

export type NutritionReport = {
  period: NutritionPeriod;
  loggedDays: number;
  dailyCalorieAverage: number;
  metrics: NutrientMetric[];
  selected: NutrientMetric;
  trend: NutrientTrendItem[];
  sources: NutrientSource[];
  insight: string;
};
