"use client";

import AddMealForm from "@/app/features/meals/components/AddMealForm";
import MealEntryCard from "@/app/features/meals/components/MealEntryCard";
import { Button } from "@/components/ui/button";
import { NewMealEntryWithFo0d } from "@/db/food-schema";
import { useState } from "react";

export default function AddMeal() {
  const [entries, setEntries] = useState<NewMealEntryWithFo0d[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="m-4">
      <div className="container">
        <h2 className="title">Food</h2>
        {entries.length === 0 && (
          <div className="text-center p-4 flex flex-col gap-4 py-8 ">
            <h3>No food addded</h3>
            <Button onClick={() => setIsModalOpen(true)}>Add</Button>
          </div>
        )}

        {entries.length > 0 && (
          <div>
            {entries.map((entry) => (
              <MealEntryCard key={entry.id} mealEntry={entry} />
            ))}
          </div>
        )}

        {entries.length > 0 && (
          <Button onClick={() => setIsModalOpen(true)}>Add more</Button>
        )}
      </div>
      <AddMealForm isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
}
