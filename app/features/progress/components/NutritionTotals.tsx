import type { NutritionProfile } from "@/db/profile-schema";
import type { ProgressSummary } from "../summary";

const macroNames = [
  "Protein",
  "Total carbohydrates",
  "Total fat",
] as const;

const macroLabels = {
  Protein: "Protein",
  "Total carbohydrates": "Carbohydrate",
  "Total fat": "Fat",
};

export default function NutritionTotals({
  summary,
  profile,
}: {
  summary: ProgressSummary;
  profile: NutritionProfile;
}) {
  const macroTargets = {
    Protein: profile.dailyProteinGrams,
    "Total carbohydrates": profile.dailyCarbohydrateGrams,
    "Total fat": profile.dailyFatGrams,
  };

  return (
    <section className="lg:pr-8">
      <h2 className="section-heading">Nutrition totals</h2>
      <div className="mt-4 divide-y">
        {macroNames.map((name) => {
          const nutrient = summary.totals[name];
          const target = macroTargets[name] * summary.days.length;
          const average = summary.loggedDays
            ? Math.round(nutrient.amount / summary.loggedDays)
            : 0;
          const progress = Math.min(
            100,
            (nutrient.amount / Math.max(1, target)) * 100,
          );

          return (
            <div key={name} className="py-5">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold">{macroLabels[name]}</p>
                  <p className="text-sm text-muted-foreground">
                    Avg. {average} g/logged day
                  </p>
                </div>
                <p className="font-medium tabular-nums">
                  {Math.round(nutrient.amount).toLocaleString("en-GB")} g
                  <span className="text-muted-foreground">
                    {" "}/ {target.toLocaleString("en-GB")} g
                  </span>
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-chart-3"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
