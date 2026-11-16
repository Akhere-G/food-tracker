import type { NutritionProfile } from "@/db/profile-schema";
import {
  energyValue,
  type EnergyUnit,
} from "@/app/features/settings/units";
import type { ProgressSummary } from "../summary";

type DashboardMetricsProps = {
  summary: ProgressSummary;
  profile: NutritionProfile;
  energyUnit: EnergyUnit;
};

export default function DashboardMetrics({
  summary,
  profile,
  energyUnit,
}: DashboardMetricsProps) {
  return (
    <section className="mt-8 grid border-y py-7 md:grid-cols-2 md:divide-x">
      <Metric
        label="Daily average"
        value={summary.dailyAverage}
        target={profile.dailyCalories}
        unit={energyUnit}
      />
      <Metric
        label="Period total"
        value={summary.totalCalories}
        target={profile.dailyCalories * summary.days.length}
        unit={energyUnit}
      />
    </section>
  );
}

function Metric({
  label,
  value,
  target,
  unit,
}: {
  label: string;
  value: number;
  target: number;
  unit: EnergyUnit;
}) {
  const progress = Math.min(100, (value / Math.max(1, target)) * 100);

  return (
    <div className="py-3 first:md:pr-10 last:md:pl-10">
      <p className="text-lg font-medium">{label}</p>
      <p className="data-number mt-1 text-5xl font-semibold md:text-6xl">
        {energyValue(value, unit).toLocaleString("en-GB")}
        <span className="font-sans text-base font-normal">
          {" "}/ {energyValue(target, unit).toLocaleString("en-GB")} {unit}
        </span>
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
