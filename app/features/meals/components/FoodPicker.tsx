"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FoodSearchItem } from "@/integrations/all-nutrients/schema";
import type { MealEntryData } from "../types";
import BarcodeForm from "./BarcodeForm";
import SearchForm from "./SearchForm";
import ServingsForm from "./ServingsForm";

type FoodPickerProps = {
  submitAction: (entry: MealEntryData) => boolean;
  closeAction: () => void;
};

export default function FoodPicker({
  submitAction,
  closeAction,
}: FoodPickerProps) {
  const [selectedFood, setSelectedFood] = useState<FoodSearchItem | null>(null);

  function selectServing(entry: MealEntryData) {
    if (submitAction(entry)) closeAction();
  }

  if (selectedFood) {
    return (
      <ServingsForm
        foodSearchItem={selectedFood}
        clearFoodItem={() => setSelectedFood(null)}
        onSelectServing={selectServing}
      />
    );
  }

  return (
    <div className="min-w-0">
      <h3 className="mb-2 text-lg">Add food</h3>
      <Tabs defaultValue="search" className="min-w-0">
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="barcode">Barcode</TabsTrigger>
        </TabsList>
        <TabsContent value="search" className="min-w-0">
          <SearchForm selectFood={setSelectedFood} />
        </TabsContent>
        <TabsContent value="barcode">
          <BarcodeForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
