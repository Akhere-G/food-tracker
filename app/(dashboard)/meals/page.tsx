import MealsHeader from "@/app/features/meals/components/MealsHeader";
import MealsList from "@/app/features/meals/components/MealsList";
import React from "react";
import { meals } from "./data";

export default function MealsPage() {
  return (
    <div>
      <MealsHeader meals={meals} />
      <MealsList meals={meals} />
    </div>
  );
}
