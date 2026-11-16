import { TZDate } from "@date-fns/tz";
import AddMealForm from "@/app/features/meals/components/AddMealForm";
import {
  resolveMealFormDateTime,
  type MealFormSearchParams,
} from "@/app/features/meals/form-date-time";
import { getOnboardingProfile, getPreferences } from "@/app/features/onboarding/service";
import { requireUserId } from "@/lib/auth-session";

export default async function AddMealPage({
  searchParams,
}: {
  searchParams: Promise<MealFormSearchParams>;
}) {
  const [params, userId] = await Promise.all([searchParams, requireUserId()]);
  const [profile, preferences] = await Promise.all([
    getOnboardingProfile(userId),
    getPreferences(userId),
  ]);
  const timezone = profile?.timezone ?? "Europe/London";
  const formDateTime = resolveMealFormDateTime(params, TZDate.tz(timezone));

  return (
    <AddMealForm
      {...formDateTime}
      energyUnit={preferences?.energyUnit === "kj" ? "kj" : "kcal"}
      timezone={timezone}
    />
  );
}
