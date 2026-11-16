import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireUserId } from "@/lib/auth-session";
import { getOnboardingProfile } from "@/app/features/onboarding/service";
import { getMeals } from "@/app/features/meals/service";
import DashboardOverview from "@/app/features/progress/components/DashboardOverview";
import PeriodControls from "@/app/features/progress/components/PeriodControls";
import {
  parseProgressPeriod,
  periodRange,
} from "@/app/features/progress/period";
import { buildProgressSummary } from "@/app/features/progress/summary";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; date?: string }>;
}) {
  const { period: periodValue, date } = await searchParams;
  const userId = await requireUserId();
  const profile = await getOnboardingProfile(userId);
  if (!profile) return null;

  const period = parseProgressPeriod(periodValue);
  const range = periodRange(period, profile.timezone, date);
  const meals = await getMeals({ startDate: range.start, endDate: range.end });
  const summary = buildProgressSummary(
    meals,
    range.start,
    range.end,
    profile.timezone,
    period,
  );

  return (
    <div className="page-shell">
      <header className="flex flex-col gap-6 border-b pb-7 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Nutrition overview</p>
          <h1 className="title mt-1">Your {period}</h1>
        </div>
        <Button size="lg" render={<Link href="/addmeal" />}>
          <Plus /> Add meal
        </Button>
      </header>
      <div className="mt-6">
        <PeriodControls period={period} {...range} />
      </div>
      <DashboardOverview summary={summary} profile={profile} />
    </div>
  );
}
