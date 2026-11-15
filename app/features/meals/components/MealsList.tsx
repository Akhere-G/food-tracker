import { Meal } from "@/db/food-schema";
import { Dot, Pencil, Plus } from "lucide-react";
import React from "react";
import { MacroShortSymbol } from "../../food/nutrients";
import { Button } from "@/components/ui/button";

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
        <div key={hour}>
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
                <div key={meal.id}>
                  <div className="flex flex-col gap-4 rounded-md">
                    {meal.entries.map((entry) => (
                      <div
                        className="p-4 flex flex-col gap-2 bg-card"
                        key={entry.id}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex text-sm">
                              <p>{entry.food.name}</p>
                              <Dot />
                              <div className="flex items-center">
                                {!!entry.serving && (
                                  <p className="text-xs text-secondary-foreground">
                                    {entry.servingQuantity}
                                    <span className="ml-2">
                                      {entry.serving?.label}
                                    </span>
                                  </p>
                                )}
                                {!entry.serving && (
                                  <p>{entry.amountInGrams} g</p>
                                )}
                              </div>
                            </div>
                            <Button>
                              <Pencil />
                            </Button>
                          </div>
                          <div className="flex flex-wrap text-xs gap-2">
                            {entry.food.nutrients.map((nutrient) => {
                              const symbol =
                                MacroShortSymbol[nutrient.nutrient.name];
                              if (!symbol) {
                                return null;
                              }

                              return (
                                <span
                                  className="flex bg-secondary rounded-full px-2 items-center"
                                  key={nutrient.nutrientId}
                                >
                                  {symbol}{" "}
                                  {(Number(nutrient.amountPer100g) *
                                    Number(entry.amountInGrams)) /
                                    100}
                                  {nutrient.nutrient.unit}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
