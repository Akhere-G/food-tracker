import { getMeals } from "@/app/features/meals/actions";
import MealsHeader from "@/app/features/meals/components/MealsHeader";
import MealsList from "@/app/features/meals/components/MealsList";
import Loader from "@/components/layout/Loader";
import { addDays, isValid, startOfDay } from "date-fns";
import React, { Suspense } from "react";

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<{ date: string }>;
}) {
  const dateStr = (await searchParams).date;
  const date = dateStr ? new Date(dateStr) : new Date();
  const valdiatedDate = isValid(date) ? date : new Date();

  const startDate = startOfDay(valdiatedDate);
  const endDate = addDays(startDate, 1);

  const mealsPromise = getMeals({ startDate, endDate });
  return (
    <Suspense fallback={<Loader />}>
      <div>
        <MealsHeader mealsPromise={mealsPromise} />
        <MealsList mealsPromise={mealsPromise} />
      </div>
    </Suspense>
  );
}
