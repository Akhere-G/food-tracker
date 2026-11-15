"use client";
import { Button } from "@/components/ui/button";
import { Meal } from "@/db/food-schema";
import { Calendar, ChevronLeft, ChevronRight, Dot, Menu } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  addDays,
  formatDate,
  isSameDay,
  isToday,
  isTomorrow,
  isValid,
  isYesterday,
  startOfWeek,
} from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { calculateNutrients } from "../utils";
import NutrientTotal from "./NutrientTotal";
export default function MealsHeader({ meals }: { meals: Meal[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dateStr = searchParams.get("date");
  const date = dateStr ? new Date(dateStr) : new Date();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentDate = isValid(date) ? new Date(date!) : new Date();

  const start = startOfWeek(currentDate);
  const days = [0, 1, 2, 3, 4, 5, 6].map((day) => addDays(start, day));
  const currentDateButtonRef = useRef<HTMLButtonElement | null>(null);
  const datePickerRef = useRef<HTMLInputElement | null>(null);

  const setCurrentDate = (newDate: Date) =>
    router.push(`/meals?date=${formatDate(newDate, "yyyy-MM-dd")}`);

  const allEntries = meals.flatMap((m) => m.entries);
  const nutrientTotals = calculateNutrients(allEntries);
  useEffect(() => {
    if (currentDateButtonRef.current) {
      currentDateButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentDate]);

  let dateTitle = formatDate(currentDate, "dd/MM/yy");
  if (isToday(currentDate)) {
    dateTitle = "Today";
  } else if (isYesterday(currentDate)) {
    dateTitle = "Yesterday";
  } else if (isTomorrow(currentDate)) {
    dateTitle = "Tomorrow";
  }
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 py-2">
        <div className="flex justify-center ">
          <div className="relative flex gap-2 items-center justify-between ">
            <Button onClick={() => setCurrentDate(addDays(currentDate, -1))}>
              <ChevronLeft />
            </Button>
            <div className="">
              <span className="w-20 text-center">{dateTitle}</span>
            </div>
            <Button onClick={() => setCurrentDate(addDays(currentDate, 1))}>
              <ChevronRight />
            </Button>
          </div>
          <div className="absolute right-4">
            <Button
              variant="secondary"
              onClick={() => datePickerRef.current?.showPicker()}
            >
              <Calendar />
            </Button>
            <input
              ref={datePickerRef}
              type="date"
              className="w-0"
              onChange={(e) => setCurrentDate(new Date(e.target.value))}
            />
          </div>
        </div>
        <div className="flex gap-0 justify-evenly overflow-y-scroll">
          {days.map((date) => {
            const selected = isSameDay(date, currentDate);
            return (
              <Button
                ref={selected ? currentDateButtonRef : null}
                key={date.valueOf()}
                onClick={() => setCurrentDate(date)}
                className={`hover:bg-accent py-10 px-3 bg-card text-secondary-foreground flex flex-col gap-0 ${selected ? "bg-accent" : ""}`}
              >
                <span className="text-sm text-muted-foreground">
                  {formatDate(date, "ccccc")}
                </span>
                <span>
                  <span>{formatDate(date, "dd")}</span>
                  <Dot
                    className={`text-primary ${selected ? "opacity-100" : "opacity-0"}`}
                  />
                </span>
              </Button>
            );
          })}
        </div>
        <div className="grid gap-4 flex-wrap grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {Object.values(nutrientTotals).map((nutrientTotal) => (
            <NutrientTotal
              key={nutrientTotal.name}
              nutrientTotal={nutrientTotal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
