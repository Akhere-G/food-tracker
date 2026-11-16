import { CalendarCheck, Flame, Sparkles } from "lucide-react";
import type { NutritionReport } from "../types";

export default function NutritionSummaryBand({
  report,
}: {
  report: NutritionReport;
}) {
  const items = [
    {
      icon: CalendarCheck,
      label: "Days logged",
      value: report.loggedDays.toLocaleString("en-GB"),
    },
    {
      icon: Flame,
      label: "Daily calorie average",
      value: `${Math.round(report.dailyCalorieAverage).toLocaleString("en-GB")} kcal`,
    },
    {
      icon: Sparkles,
      label: "Your targets",
      value: "Adapted to your plan",
    },
  ];

  return (
    <dl className="grid border-b sm:grid-cols-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 border-b py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:border-r-0"
        >
          <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
          <div>
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {label}
            </dt>
            <dd className="mt-1 font-medium tabular-nums">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
