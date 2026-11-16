import DangerZone from "@/app/features/settings/components/DangerZone";
import NutritionGoals from "@/app/features/settings/components/NutritionGoals";
import PasswordForm from "@/app/features/settings/components/PasswordForm";
import PreferencesForm from "@/app/features/settings/components/PreferencesForm";
import { profileToOnboardingInput } from "@/app/features/onboarding/mappers";
import { getOnboardingProfile, getPreferences } from "@/app/features/onboarding/service";
import type { PreferencesInput } from "@/app/features/onboarding/schemas";
import { requireUserId } from "@/lib/auth-session";

const defaultPreferences: PreferencesInput = {
  themeMode: "system",
  colorTheme: "cranberry",
  weightUnit: "kg",
  heightUnit: "cm",
  energyUnit: "kcal",
  mealReminders: false,
  dailyReminder: false,
  weeklySummary: true,
  goalMilestones: true,
  productUpdates: false,
};

export default async function SettingsPage() {
  const userId = await requireUserId();
  const [profile, storedPreferences] = await Promise.all([
    getOnboardingProfile(userId),
    getPreferences(userId),
  ]);
  if (!profile) return null;
  const preferences = storedPreferences
    ? {
        themeMode: storedPreferences.themeMode,
        colorTheme: storedPreferences.colorTheme,
        weightUnit: storedPreferences.weightUnit,
        heightUnit: storedPreferences.heightUnit,
        energyUnit: storedPreferences.energyUnit,
        mealReminders: storedPreferences.mealReminders,
        dailyReminder: storedPreferences.dailyReminder,
        weeklySummary: storedPreferences.weeklySummary,
        goalMilestones: storedPreferences.goalMilestones,
        productUpdates: storedPreferences.productUpdates,
      } as PreferencesInput
    : defaultPreferences;

  return (
    <div className="page-shell max-w-5xl">
      <header className="border-b pb-7"><p className="text-sm font-medium text-primary">Your account</p><h1 className="title mt-1">Settings</h1><p className="mt-3 max-w-2xl text-muted-foreground">Keep the plan useful as your circumstances change.</p></header>
      <div className="mt-8 space-y-10">
        <NutritionGoals value={profileToOnboardingInput(profile)} />
        <PreferencesForm initialValue={preferences} />
        <PasswordForm />
        <DangerZone />
      </div>
    </div>
  );
}
