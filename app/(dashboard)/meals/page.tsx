import { Suspense } from "react";
import { getMeals } from "@/app/features/meals/actions";
import MealsHeader from "@/app/features/meals/components/MealsHeader";
import MealsList from "@/app/features/meals/components/MealsList";
import { getOnboardingProfile } from "@/app/features/onboarding/service";
import { dayRange } from "@/app/features/progress/period";
import Loader from "@/components/layout/Loader";
import { requireUserId } from "@/lib/auth-session";

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const userId = await requireUserId();
  const profile = await getOnboardingProfile(userId);
  if (!profile) return null;
  const range = dayRange(profile.timezone, date);
  const mealsPromise = getMeals({ startDate: range.start, endDate: range.end });
  const goals = {
    Calories: profile.dailyCalories,
    Protein: profile.dailyProteinGrams,
    "Total carbohydrates": profile.dailyCarbohydrateGrams,
    "Total fat": profile.dailyFatGrams,
  };

  return (
    <Suspense fallback={<Loader />}>
      <div className="page-shell">
        <MealsHeader mealsPromise={mealsPromise} goals={goals} />
        <MealsList mealsPromise={mealsPromise} />
      </div>
    </Suspense>
  );
}
