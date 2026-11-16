import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchForm from "./SearchForm";
import BarcodeForm from "./BarcodeForm";
import { useState } from "react";
import { FoodSearchItem } from "@/integrations/all-nutrients/schema";
import ServingsForm from "./ServingsForm";
import { MealEntryData } from "../types";

interface MealFormProps {
  sumbitAction: (entry: MealEntryData) => void;
  closeForm: () => void;
}
export default function MealForm({ sumbitAction, closeForm }: MealFormProps) {
  const [selectedFood, setSelectedFood] = useState<FoodSearchItem | null>(null);
  const tabs = [
    {
      triggerLabel: "Search",
      value: "search",
      content: <SearchForm selectFood={setSelectedFood} />,
    },
    { triggerLabel: "Barcode", value: "barcode", content: <BarcodeForm /> },
  ];
  const onSelectServing = (mealEntryData: MealEntryData) => {
    sumbitAction(mealEntryData);
    closeForm();
  };
  return (
    <div>
      {!selectedFood && (
        <div>
          <h3 className="text-lg mb-2">Add food</h3>
          <Tabs defaultValue={tabs[0].value}>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.triggerLabel} value={tab.value}>
                  {tab.triggerLabel}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.triggerLabel} value={tab.value}>
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
      {!!selectedFood && (
        <ServingsForm
          foodSearchItem={selectedFood}
          clearFoodItem={() => setSelectedFood(null)}
          onSelectServing={onSelectServing}
        />
      )}
    </div>
  );
}
