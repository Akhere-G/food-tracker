import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import MealEditor from "@/app/features/meals/components/MealEditor";
import { mealEntryToDraft } from "@/app/features/meals/mappers";
import { getMeal } from "@/app/features/meals/service";
import { getOnboardingProfile } from "@/app/features/onboarding/service";
import { requireUserId } from "@/lib/auth-session";

export default async function EditMealPage({
  params,
}: {
  params: Promise<{ mealId: string }>;
}) {
  const { mealId } = await params;
  const userId = await requireUserId();
  const [meal, profile] = await Promise.all([
    getMeal(mealId).catch(() => null),
    getOnboardingProfile(userId),
  ]);
  if (!meal || !profile) notFound();

  const eatenAt = new TZDate(meal.eatenAt, profile.timezone);
  return (
    <MealEditor
      mode="update"
      mealId={meal.id}
      initialDate={format(eatenAt, "yyyy-MM-dd")}
      initialTime={format(eatenAt, "HH:mm")}
      initialEntries={meal.entries.flatMap((entry) => {
        const draft = mealEntryToDraft(entry);
        return draft ? [draft] : [];
      })}
    />
  );
}
