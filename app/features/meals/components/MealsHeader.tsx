"use client";

import { use, useRef } from "react";
import {
  addDays,
  format,
  isSameDay,
  isToday,
  isTomorrow,
  isYesterday,
  startOfWeek,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { energyValue, type EnergyUnit } from "@/app/features/settings/units";
import ErrorComponent from "@/components/layout/Error";
import { Button } from "@/components/ui/button";
import type { Meal } from "@/db/food-schema";
import type { ActionResult } from "@/lib/action";
import { isValidDateInput } from "@/lib/date-input";
import { calculateNutrients } from "../utils";
import NutrientTotal from "./NutrientTotal";

type Goals = {
  Calories: number;
  Protein: number;
  "Total carbohydrates": number;
  "Total fat": number;
};

function selectedDate(value: string | null) {
  return isValidDateInput(value)
    ? new Date(`${value}T12:00:00`)
    : new Date();
}

export default function MealsHeader({
  mealsPromise,
  goals,
  energyUnit,
}: {
  mealsPromise: Promise<ActionResult<Meal[]>>;
  goals: Goals;
  energyUnit: EnergyUnit;
}) {
  const result = use(mealsPromise);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = selectedDate(searchParams.get("date"));
  const datePickerRef = useRef<HTMLInputElement | null>(null);
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));

  if (!result.success) return <ErrorComponent message={result.error} />;
  const totals = calculateNutrients(result.data.flatMap((meal) => meal.entries));
  for (const [name, target] of Object.entries(goals)) {
    totals[name].dailyMax = target;
  }

  if (energyUnit === "kj") {
    totals.Calories.amount = energyValue(totals.Calories.amount, "kj");
    totals.Calories.dailyMax = energyValue(totals.Calories.dailyMax, "kj");
    totals.Calories.unit = "kj";
  }
  const dateTitle = isToday(currentDate)
    ? "Today"
    : isYesterday(currentDate)
      ? "Yesterday"
      : isTomorrow(currentDate)
        ? "Tomorrow"
        : format(currentDate, "EEEE, d MMMM");
  const openDate = (date: Date) => {
    router.push(`/meals?date=${format(date, "yyyy-MM-dd")}`);
  };

  return (
    <header>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="text-sm font-medium text-primary">Daily log</p>
          <h1 className="title mt-1">{dateTitle}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDate(addDays(currentDate, -1))}
            aria-label="Previous day"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            onClick={() => datePickerRef.current?.showPicker()}
          >
            <Calendar /> Choose date
          </Button>
          <input
            ref={datePickerRef}
            type="date"
            className="sr-only"
            value={format(currentDate, "yyyy-MM-dd")}
            onChange={(event) =>
              openDate(new Date(`${event.target.value}T12:00:00`))
            }
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDate(addDays(currentDate, 1))}
            aria-label="Next day"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div
        className="mt-5 grid grid-cols-7 gap-1"
        aria-label="Week beginning Monday"
      >
        {days.map((date) => {
          const active = isSameDay(date, currentDate);
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => openDate(date)}
              aria-current={active ? "date" : undefined}
              className={`rounded-lg py-3 text-center text-sm ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <span className="block text-xs opacity-75">
                {format(date, "EEEEE")}
              </span>
              <span className="mt-1 block font-semibold">
                {format(date, "d")}
              </span>
            </button>
          );
        })}
      </div>
      <section
        className="mt-6 grid gap-4 border-y py-6 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Daily nutrition totals"
      >
        {Object.values(totals).map((total) => (
          <NutrientTotal key={total.name} nutrientTotal={total} />
        ))}
      </section>
    </header>
  );
}
