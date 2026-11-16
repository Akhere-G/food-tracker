import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NUTRITION_PERIODS, type NutritionPeriod } from "../period";
import PeriodPicker from "./PeriodPicker";

type NutritionPeriodControlsProps = {
  period: NutritionPeriod;
  anchor: string;
  label: string;
  pickerValue: string;
  previous: string;
  next: string;
  nutrient: string;
};

export default function NutritionPeriodControls({
  period,
  anchor,
  label,
  pickerValue,
  previous,
  next,
  nutrient,
}: NutritionPeriodControlsProps) {
  const href = (nextPeriod: NutritionPeriod, date = anchor) =>
    `/nutrition?period=${nextPeriod}&date=${date}&nutrient=${encodeURIComponent(nutrient)}`;

  return (
    <div className="grid gap-4 border-b py-5 lg:grid-cols-[auto_1fr] lg:items-center">
      <div className="grid grid-cols-4 rounded-xl border p-1">
        {NUTRITION_PERIODS.map((item) => (
          <Link
            key={item}
            href={href(item)}
            className={cn(
              "flex min-h-10 items-center justify-center rounded-lg px-3 text-sm font-medium capitalize",
              item === period
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            {item}
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-between gap-1 lg:justify-end">
        <Link
          href={href(period, previous)}
          className="grid size-11 place-items-center rounded-lg hover:bg-muted"
          aria-label={`Previous ${period}`}
        >
          <ChevronLeft aria-hidden="true" />
        </Link>
        <div className="relative flex min-h-11 min-w-0 max-w-sm flex-1 items-center justify-center gap-2 rounded-lg px-2 font-medium hover:bg-muted lg:flex-none lg:px-5">
          <CalendarDays aria-hidden="true" className="size-4 text-muted-foreground" />
          <span className="truncate">{label}</span>
          <ChevronDown aria-hidden="true" className="size-4" />
          <PeriodPicker period={period} value={pickerValue} nutrient={nutrient} />
        </div>
        <Link
          href={href(period, next)}
          className="grid size-11 place-items-center rounded-lg hover:bg-muted"
          aria-label={`Next ${period}`}
        >
          <ChevronRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
