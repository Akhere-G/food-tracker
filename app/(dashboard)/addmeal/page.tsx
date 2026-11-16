import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import AddMealForm from "@/app/features/meals/components/AddMealForm";
import { getOnboardingProfile, getPreferences } from "@/app/features/onboarding/service";
import { requireUserId } from "@/lib/auth-session";

export default async function AddMealPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; time?: string }>;
}) {
  const params = await searchParams;
  const userId = await requireUserId();
  const [profile, preferences] = await Promise.all([
    getOnboardingProfile(userId),
    getPreferences(userId),
  ]);
  const now = profile ? TZDate.tz(profile.timezone) : new Date();
  const initialDate = /^\d{4}-\d{2}-\d{2}$/.test(params.date ?? "")
    ? params.date!
    : format(now, "yyyy-MM-dd");
  const initialTime = /^\d{2}:\d{2}$/.test(params.time ?? "")
    ? params.time!
    : format(now, "HH:mm");

  return (
    <AddMealForm
      initialDate={initialDate}
      initialTime={initialTime}
      energyUnit={preferences?.energyUnit === "kj" ? "kj" : "kcal"}
      timezone={profile?.timezone ?? "Europe/London"}
    />
  );
}
