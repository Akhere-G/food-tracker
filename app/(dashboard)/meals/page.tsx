import MealsHeader from "@/app/features/meals/components/MealsHeader";
import MealsList from "@/app/features/meals/components/MealsList";
import { Meal } from "@/db/food-schema";
import React from "react";

const meals: Meal[] = [];

export default function MealsPage() {
  return (
    <div>
      <MealsHeader meals={meals} />
      <MealsList meals={meals} />
    </div>
  );
}
