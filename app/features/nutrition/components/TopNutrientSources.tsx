import { Soup } from "lucide-react";
import { formatNutrientAmount } from "../format";
import type { NutrientMetric, NutrientSource } from "../types";

export default function TopNutrientSources({
  metric,
  sources,
}: {
  metric: NutrientMetric;
  sources: NutrientSource[];
}) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="font-semibold">Top food sources</h3>
        <span className="text-xs text-muted-foreground">This period</span>
      </div>
      {sources.length ? (
        <ol className="border-y">
          {sources.map((source, index) => (
            <li
              key={source.foodId}
              className="flex items-center justify-between gap-4 border-b py-3 last:border-b-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="truncate font-medium">{source.name}</span>
              </div>
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                {formatNutrientAmount(source.amount, metric.unit)}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="flex items-center gap-3 border-y py-5 text-sm text-muted-foreground">
          <Soup aria-hidden="true" className="size-5 text-primary" />
          No food sources recorded for this nutrient yet.
        </div>
      )}
    </section>
  );
}
