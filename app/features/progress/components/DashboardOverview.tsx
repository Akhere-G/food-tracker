import { format } from "date-fns";
import type { NutritionProfile } from "@/db/profile-schema";
import type { buildProgressSummary } from "../summary";
import {
  energyValue,
  weightValue,
  type EnergyUnit,
  type WeightUnit,
} from "@/app/features/settings/units";

type Summary = ReturnType<typeof buildProgressSummary>;

const macroNames = ["Protein", "Total carbohydrates", "Total fat"] as const;
const macroLabels = {
  Protein: "Protein",
  "Total carbohydrates": "Carbohydrate",
  "Total fat": "Fat",
};

export default function DashboardOverview({
  summary,
  profile,
  energyUnit,
  weightUnit,
}: {
  summary: Summary;
  profile: NutritionProfile;
  energyUnit: EnergyUnit;
  weightUnit: WeightUnit;
}) {
  const chartTarget =
    profile.dailyCalories * (summary.days.length / summary.chart.length);
  const maxCalories = Math.max(
    chartTarget,
    ...summary.chart.map((item) => item.calories),
  );
  const macroTargets = {
    Protein: profile.dailyProteinGrams,
    "Total carbohydrates": profile.dailyCarbohydrateGrams,
    "Total fat": profile.dailyFatGrams,
  };
  const targetDate = profile.targetDate
    ? format(new Date(`${profile.targetDate}T12:00:00`), "d MMMM yyyy")
    : null;

  return (
    <>
      <section className="mt-8 grid border-y py-7 md:grid-cols-2 md:divide-x">
        <Metric label="Daily average" value={summary.dailyAverage} target={profile.dailyCalories} unit={energyUnit} />
        <Metric label="Period total" value={summary.totalCalories} target={profile.dailyCalories * summary.days.length} unit={energyUnit} />
      </section>
      <div className="grid gap-8 border-b py-7 lg:grid-cols-[1fr_1.15fr] lg:divide-x">
        <section className="lg:pr-8">
          <h2 className="section-heading">Nutrition totals</h2>
          <div className="mt-4 divide-y">
            {macroNames.map((name) => {
              const nutrient = summary.totals[name];
              const target = macroTargets[name] * summary.days.length;
              return (
                <div key={name} className="py-5">
                  <div className="flex justify-between gap-4">
                    <div><p className="font-semibold">{macroLabels[name]}</p><p className="text-sm text-muted-foreground">Avg. {summary.loggedDays ? Math.round(nutrient.amount / summary.loggedDays) : 0} g/logged day</p></div>
                    <p className="font-medium tabular-nums">{Math.round(nutrient.amount).toLocaleString("en-GB")} g <span className="text-muted-foreground">/ {target.toLocaleString("en-GB")} g</span></p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-chart-3" style={{ width: `${Math.min(100, (nutrient.amount / Math.max(1, target)) * 100)}%` }} /></div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="lg:pl-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><h2 className="section-heading">Weight direction</h2><p className="data-number mt-2 text-4xl font-semibold">{weightValue(Number(profile.currentWeightKg), weightUnit)} {weightUnit}</p><p className="text-sm text-muted-foreground">Goal {weightValue(Number(profile.targetWeightKg), weightUnit)} {weightUnit}</p></div>
            {targetDate && <p className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">Estimated {targetDate}</p>}
          </div>
          <div className="mt-10 flex items-center gap-3" aria-label={`From ${weightValue(Number(profile.currentWeightKg), weightUnit)} ${weightUnit} to ${weightValue(Number(profile.targetWeightKg), weightUnit)} ${weightUnit}`}>
            <span className="size-4 rounded-full bg-primary" /><span className="h-0.5 flex-1 border-t-2 border-dashed border-primary" /><span className="size-4 rounded-full border-4 border-primary bg-background" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>Today</span><span>Target</span></div>
        </section>
      </div>
      <section className="grid gap-8 py-7 lg:grid-cols-[1.35fr_1fr]">
        <div><h2 className="section-heading">Intake pattern</h2><div className="mt-5 flex h-56 items-end gap-2 border-b border-l px-3 pt-4">{summary.chart.map((item, index) => <div key={item.key} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="hidden text-xs tabular-nums text-muted-foreground sm:block">{item.calories || "—"}</span><span className="w-full max-w-14 rounded-t bg-chart-protein" style={{ height: `${Math.max(8, (item.calories / Math.max(1, maxCalories)) * 160)}px`, opacity: item.calories ? 1 : 0.2 }} /><span className="text-[10px] sm:text-xs">{summary.chart.length <= 14 ? item.label : index % Math.ceil(summary.chart.length / 10) === 0 ? index + 1 : ""}</span></div>)}</div></div>
        <aside className="border-l-4 border-primary pl-6"><p className="font-heading text-3xl font-semibold italic">{summary.loggedDays ? `${summary.loggedDays} logged ${summary.loggedDays === 1 ? "day" : "days"} — consistency is building.` : "Your next meal is a fresh start."}</p><p className="mt-4 leading-relaxed text-muted-foreground">Progress is information, not a verdict. Your average and totals update as meals are logged.</p></aside>
      </section>
    </>
  );
}

function Metric({ label, value, target, unit }: { label: string; value: number; target: number; unit: EnergyUnit }) {
  return <div className="py-3 first:md:pr-10 last:md:pl-10"><p className="text-lg font-medium">{label}</p><p className="data-number mt-1 text-5xl font-semibold md:text-6xl">{energyValue(value, unit).toLocaleString("en-GB")} <span className="font-sans text-base font-normal">/ {energyValue(target, unit).toLocaleString("en-GB")} {unit}</span></p><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (value / Math.max(1, target)) * 100)}%` }} /></div></div>;
}
