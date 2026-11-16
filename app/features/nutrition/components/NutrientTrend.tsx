import { formatNutrientAmount } from "../format";
import type { NutrientMetric, NutrientTrendItem } from "../types";

export default function NutrientTrend({
  metric,
  trend,
}: {
  metric: NutrientMetric;
  trend: NutrientTrendItem[];
}) {
  const maximum = Math.max(metric.dailyTarget, ...trend.map((item) => item.amount), 1);

  if (trend.length === 0) {
    return (
      <div className="grid min-h-52 place-items-center border-y text-center text-sm text-muted-foreground">
        <p>Log a meal to start your {metric.name.toLowerCase()} trend.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative flex min-h-56 items-end gap-2 border-y px-1 pt-9 sm:gap-3">
        <div
          className="absolute inset-x-0 border-t border-dashed border-primary/50"
          style={{ bottom: `${Math.min((metric.dailyTarget / maximum) * 100, 100)}%` }}
        >
          <span className="absolute -top-6 right-0 text-[11px] text-muted-foreground">
            Daily guide
          </span>
        </div>
        {trend.map((item) => (
          <div
            key={item.key}
            className="group flex min-w-0 flex-1 flex-col items-center justify-end self-stretch"
          >
            <span className="mb-2 hidden text-[11px] font-medium tabular-nums group-hover:block sm:block">
              {item.logged
                ? formatNutrientAmount(item.amount, metric.unit)
                : "—"}
            </span>
            <div className="flex h-full w-full items-end justify-center">
              <div
                className="w-full max-w-10 rounded-t-md bg-primary/85 transition-opacity group-hover:bg-primary"
                style={{
                  height: item.logged
                    ? `${Math.max((item.amount / maximum) * 100, 3)}%`
                    : "3%",
                  opacity: item.logged ? 1 : 0.14,
                }}
              />
            </div>
            <span className="mt-2 text-xs font-semibold">{item.label}</span>
            <span className="mt-0.5 truncate text-[10px] text-muted-foreground">
              {item.sublabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
