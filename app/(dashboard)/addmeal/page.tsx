"use client";

import { saveMeal } from "@/app/features/meals/actions";
import AddMealForm from "@/app/features/meals/components/AddMealForm";
import NewMealEntryCard from "@/app/features/meals/components/NewMealEntryCard";
import { MealEntryData } from "@/app/features/meals/types";
import { Button } from "@/components/ui/button";
import { formatDate, isValid } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddMeal() {
  const [entries, setEntries] = useState<Map<string, MealEntryData>>(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const dateStr = searchParams.get("date");
  const date = dateStr ? new Date(dateStr) : new Date();
  const currentDate = isValid(date) ? date : new Date();
  const router = useRouter();

  const getKey = (entry: MealEntryData) =>
    entry.foodImportData.food.externalId +
    entry.foodImportData.food.externalSource;

  const addEntry = (entry: MealEntryData) => {
    const key = getKey(entry);

    setEntries((prev) => {
      const next = new Map(prev);
      next.set(key, entry);
      return next;
    });
  };

  const submit = async () => {
    setIsLoading(true);
    const result = await saveMeal({
      eatenAt: formatDate(currentDate, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      mealEntries: Array.from<MealEntryData>(entries.values()).map(
        (e) => e.mealEntryInput,
      ),
    });
    if (result.success) {
      toast.success("Added meal!");
      router.push(`/meals?${formatDate(currentDate, "yyyy-MM-dd HH:mm")}`);
    } else {
      toast.error(result.error ?? "Sorry... something went wrong.");
    }
    setIsLoading(false);
  };

  const deleteEntry = (entry: MealEntryData) => {
    const key = getKey(entry);

    setEntries((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  const mealEntries = Array.from(entries.values());

  return (
    <div className="p-4 container mx-auto">
      <div className="container">
        <h2 className="title">Food</h2>
        {mealEntries.length === 0 && (
          <div className="mt-2 border-2 border-dashed  rounded-md text-center px-4 flex flex-col gap-8 py-16 ">
            <h3>No food addded</h3>
            <Button disabled={isLoading} onClick={() => setIsModalOpen(true)}>
              Add
            </Button>
          </div>
        )}

        {mealEntries.length > 0 && (
          <div className="my-4">
            {Array.from<MealEntryData>(entries.values()).map((entry) => (
              <NewMealEntryCard
                key={getKey(entry)}
                foodImportData={entry.foodImportData}
                mealEntry={entry.mealEntryInput}
                onDelete={() => deleteEntry(entry)}
              />
            ))}
          </div>
        )}

        {mealEntries.length > 0 && (
          <div className=" mx-auto flex flex-col md:flex-row gap-2">
            <Button
              className="flex-1"
              variant="secondary"
              disabled={isLoading}
              onClick={() => setIsModalOpen(true)}
            >
              Add more
            </Button>
            <Button className="flex-1" disabled={isLoading} onClick={submit}>
              Save meal
            </Button>
          </div>
        )}
      </div>
      <AddMealForm
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        addEntry={addEntry}
      />
    </div>
  );
}
