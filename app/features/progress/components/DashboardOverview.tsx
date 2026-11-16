import type { NutritionProfile } from "@/db/profile-schema";
import type {
  EnergyUnit,
  WeightUnit,
} from "@/app/features/settings/units";
import type { ProgressSummary } from "../summary";
import DashboardMetrics from "./DashboardMetrics";
import IntakePattern from "./IntakePattern";
import NutritionTotals from "./NutritionTotals";
import ProgressEncouragement from "./ProgressEncouragement";
import WeightDirection from "./WeightDirection";

type DashboardOverviewProps = {
  summary: ProgressSummary;
  profile: NutritionProfile;
  energyUnit: EnergyUnit;
  weightUnit: WeightUnit;
};

export default function DashboardOverview({
  summary,
  profile,
  energyUnit,
  weightUnit,
}: DashboardOverviewProps) {
  return (
    <>
      <DashboardMetrics
        summary={summary}
        profile={profile}
        energyUnit={energyUnit}
      />
      <div className="grid gap-8 border-b py-7 lg:grid-cols-[1fr_1.15fr] lg:divide-x">
        <NutritionTotals summary={summary} profile={profile} />
        <WeightDirection profile={profile} weightUnit={weightUnit} />
      </div>
      <section className="grid gap-8 py-7 lg:grid-cols-[1.35fr_1fr]">
        <IntakePattern
          chart={summary.chart}
          dailyCalorieTarget={profile.dailyCalories}
          periodDayCount={summary.days.length}
        />
        <ProgressEncouragement loggedDays={summary.loggedDays} />
      </section>
    </>
  );
}
