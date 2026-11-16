"use client";
import { Meal } from "@/db/food-schema";
import { Plus } from "lucide-react";

import MealmealEntryCard from "./MealEntryCard";

import { useRouter, useSearchParams } from "next/navigation";
import { formatDate, isValid } from "date-fns";
import { ActionResult } from "@/lib/action";
import { use } from "react";
import ErrorComponent from "@/components/layout/Error";

export default function MealsList({
  mealsPromise,
}: {
  mealsPromise: Promise<ActionResult<Meal[]>>;
}) {
  const mealsResult = use(mealsPromise);

  const errorMessage = !mealsResult.success ? mealsResult.error : "";
  const meals = mealsResult.success ? mealsResult.data : [];

  const hours: Record<number, Meal[]> = {};

  const searchParams = useSearchParams();
  const dateStr = searchParams.get("date");
  const date = dateStr ? new Date(dateStr) : new Date();
  const currentDate = isValid(date) ? new Date(date!) : new Date();

  for (let i = 0; i < 24; i++) {
    hours[i] = [];
  }
  for (const meal of meals) {
    const hour = new Date(meal.eatenAt).getHours();

    hours[hour].push(meal);
  }

  const groupedMeals = Object.entries(hours);

  const router = useRouter();

  if (errorMessage) {
    return <ErrorComponent message={errorMessage} />;
  }

  return (
    <div className="flex flex-col gap-4 px-2">
      {groupedMeals.map(([hour, meals]) => {
        const time = String(hour).padStart(2, "0") + ":00";
        return (
          <div className="relative flex flex-col" key={hour}>
            <div className="w-2 h-full flex-1 left-6 top-7 -z-1 bg-muted absolute" />
            <div className="flex gap-2 items-center">
              <p className="w-14 h-7 bg-secondary flex center items-center justify-center  rounded-full">
                {time}
              </p>
              <button
                className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center"
                onClick={() =>
                  router.push(
                    `/addmeal?date=${formatDate(currentDate, "yyyy-MM-dd")} ${time}`,
                  )
                }
              >
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
        );
      })}
    </div>
  );
}
