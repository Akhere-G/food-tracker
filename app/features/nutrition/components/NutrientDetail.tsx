import { CircleHelp } from "lucide-react";
import { averageLabel, formatNutrientAmount, targetLabel } from "../format";
import type { NutritionPeriod } from "../period";
import type { NutritionReport } from "../types";
import NutrientTrend from "./NutrientTrend";
import TopNutrientSources from "./TopNutrientSources";

export default function NutrientDetail({
  report,
  period,
}: {
  report: NutritionReport;
  period: NutritionPeriod;
}) {
  const { selected } = report;

  return (
    <section aria-labelledby="selected-nutrient-heading">
      <p className="text-sm font-medium text-primary">Selected nutrient</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 id="selected-nutrient-heading" className="section-heading wrap-anywhere">
            {selected.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {averageLabel(period)}
          </p>
        </div>
        <div className="text-right">
          <p className="data-number text-4xl font-semibold">
            {formatNutrientAmount(selected.dailyAverage, selected.unit)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {targetLabel(selected.targetType, selected.dailyTarget, selected.unit)}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <NutrientTrend metric={selected} trend={report.trend} />
      </div>

      <div className="mt-5 flex gap-3 bg-accent/65 px-4 py-3 text-sm">
        <CircleHelp aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <p className="font-medium">{report.insight}</p>
          <p className="mt-1 text-muted-foreground">
            Guides are personalised from your profile and UK dietary references.
          </p>
        </div>
      </div>

      <TopNutrientSources metric={selected} sources={report.sources} />
    </section>
  );
}
