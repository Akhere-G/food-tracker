import type { ProgressSummary } from "../summary";

type ChartItem = ProgressSummary["chart"][number];

export default function IntakePattern({
  chart,
  dailyCalorieTarget,
  periodDayCount,
}: {
  chart: ChartItem[];
  dailyCalorieTarget: number;
  periodDayCount: number;
}) {
  const chartTarget = dailyCalorieTarget * (periodDayCount / chart.length);
  const maxCalories = Math.max(
    chartTarget,
    ...chart.map((item) => item.calories),
  );
  const labelInterval = Math.ceil(chart.length / 10);

  return (
    <div>
      <h2 className="section-heading">Intake pattern</h2>
      <div className="mt-5 flex h-56 items-end gap-2 border-b border-l px-3 pt-4">
        {chart.map((item, index) => (
          <div
            key={item.key}
            className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">
              {item.calories || "—"}
            </span>
            <span
              className="w-full max-w-14 rounded-t bg-chart-protein"
              style={{
                height: `${Math.max(
                  8,
                  (item.calories / Math.max(1, maxCalories)) * 160,
                )}px`,
                opacity: item.calories ? 1 : 0.2,
              }}
            />
            <span className="text-[10px] sm:text-xs">
              {chart.length <= 14
                ? item.label
                : index % labelInterval === 0
                  ? index + 1
                  : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
