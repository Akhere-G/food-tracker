import { ChevronLeft, ChevronRight } from "lucide-react";
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
        <PeriodPicker
          period={period}
          value={pickerValue}
          label={label}
          nutrient={nutrient}
        />
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
