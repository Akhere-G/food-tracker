import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NUTRIENT_SECTIONS } from "../definitions";
import { formatNutrientAmount, targetLabel } from "../format";
import type { NutritionPeriod } from "../period";
import type { NutrientMetric } from "../types";

type NutrientLedgerProps = {
  metrics: NutrientMetric[];
  selectedNutrient: string;
  period: NutritionPeriod;
  anchor: string;
};

export default function NutrientLedger({
  metrics,
  selectedNutrient,
  period,
  anchor,
}: NutrientLedgerProps) {
  const byKey = new Map(metrics.map((metric) => [metric.key, metric]));

  return (
    <div>
      <div className="mb-5">
        <p className="text-sm font-medium text-primary">Your daily average</p>
        <h2 className="section-heading mt-1">All nutrients</h2>
      </div>
      <div className="space-y-9">
        {NUTRIENT_SECTIONS.map((section) => (
          <section key={section.key} id={section.key}>
            <h3 className="mb-2 text-sm font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {section.label}
            </h3>
            <div className="border-y">
              {section.nutrients.map((key) => {
                const metric = byKey.get(key);
                return metric ? (
                  <NutrientRow
                    key={key}
                    metric={metric}
                    selected={key === selectedNutrient}
                    href={`/nutrition?period=${period}&date=${anchor}&nutrient=${encodeURIComponent(key)}`}
                  />
                ) : null;
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function NutrientRow({
  metric,
  selected,
  href,
}: {
  metric: NutrientMetric;
  selected: boolean;
  href: string;
}) {
  const progress = Math.min(metric.progress * 100, 100);

  return (
    <Link
      href={href}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "group block border-b px-2 py-4 last:border-b-0 hover:bg-muted/60",
        selected && "bg-accent/70",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-medium">
            {metric.name}
            {metric.focused ? (
              <Sparkles
                aria-label="Selected nutrition focus"
                className="size-3.5 text-primary"
              />
            ) : null}
            {metric.derived ? (
              <span className="text-xs font-normal text-muted-foreground">
                calculated
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {targetLabel(metric.targetType, metric.dailyTarget, metric.unit)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium tabular-nums">
            {formatNutrientAmount(metric.dailyAverage, metric.unit)}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full bg-primary",
            metric.targetType === "limit" && metric.progress <= 1 && "bg-chart-4",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </Link>
  );
}
