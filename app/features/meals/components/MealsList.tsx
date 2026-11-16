"use client";

import { use } from "react";
import { format } from "date-fns";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Meal } from "@/db/food-schema";
import type { ActionResult } from "@/lib/action";
import ErrorComponent from "@/components/layout/Error";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MealEntryCard from "./MealEntryCard";

export default function MealsList({
  mealsPromise,
}: {
  mealsPromise: Promise<ActionResult<Meal[]>>;
}) {
  const result = use(mealsPromise);
  const selectedDate =
    useSearchParams().get("date") ?? format(new Date(), "yyyy-MM-dd");
  if (!result.success) return <ErrorComponent message={result.error} />;

  if (result.data.length === 0) {
    return (
      <section className="mt-8 border-y py-12 text-center">
        <p className="font-heading text-2xl font-semibold">Nothing logged yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Your nutrition totals stay visible above, ready for your first meal.
        </p>
        <Link
          className={cn(buttonVariants(), "mt-5")}
          href={`/addmeal?date=${selectedDate}`}
        >
          <Plus className="size-4" /> Add a meal
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-5" aria-labelledby="meal-ledger-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="meal-ledger-heading" className="section-heading">Meal ledger</h2>
        <Link className={buttonVariants()} href={`/addmeal?date=${selectedDate}`}>
          <Plus className="size-4" /> Add meal
        </Link>
      </div>
      {result.data
        .toSorted((a, b) => a.eatenAt.getTime() - b.eatenAt.getTime())
        .map((meal) => (
          <article key={meal.id} className="overflow-hidden rounded-xl border bg-card">
            <header className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
              <p className="font-heading text-xl font-semibold">
                {format(meal.eatenAt, "HH:mm")}
              </p>
              <Link
                href={`/meals/${meal.id}/edit`}
                className={buttonVariants({ size: "sm", variant: "ghost" })}
              >
                <Pencil className="size-4" /> Edit meal
              </Link>
            </header>
            {meal.entries.map((entry) => (
              <MealEntryCard key={entry.id} mealEntry={entry} />
            ))}
          </article>
        ))}
    </section>
  );
}
