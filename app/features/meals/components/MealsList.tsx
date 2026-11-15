import { Meal } from "@/db/food-schema";
import { Dot, Pencil, Plus } from "lucide-react";
import React from "react";
import { MacroShortSymbol } from "../../food/nutrients";
import { Button } from "@/components/ui/button";
import MealmealEntryCard from "./MealEntryCard";

export default function MealsList({ meals }: { meals: Meal[] }) {
  const hours: Record<number, Meal[]> = {};

  for (let i = 0; i < 24; i++) {
    hours[i] = [];
  }
  for (const meal of meals) {
    const hour = new Date(meal.eatenAt).getHours();

    hours[hour].push(meal);
  }

  const groupedMeals = Object.entries(hours);
  return (
    <div className="flex flex-col gap-4 px-2">
      {groupedMeals.map(([hour, meals]) => (
        <div className="relative flex flex-col" key={hour}>
          <div className="w-2 h-full flex-1 left-6 top-7 -z-1 bg-muted absolute" />
          <div className="flex gap-2 items-center">
            <p className="w-14 h-7 bg-secondary flex center items-center justify-center  rounded-full">
              {String(hour).padStart(2, "0")}:00
            </p>
            <button className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center">
              <Plus size={17} />
            </button>
          </div>
          <div>
            <div className="flex flex-col gap-4 mt-2 ml-4 md:ml-8 lg:ml-16">
              {meals.map((meal) => (
                <div key={meal.id} className="flex flex-col gap-4 rounded-md">
                  {meal.entries.map((entry) => (
                    <MealmealEntryCard key={entry.id} mealEntry={entry} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
