"use client";
import { Button } from "@/components/ui/button";
import { FoodSearchItem } from "@/integrations/all-nutrients/schema";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getFoodDetails } from "../../food/actions";
import { FoodImportData } from "../../food/schemas";
import { Input } from "@/components/ui/input";
import { MealEntryData } from "../types";
import Loader from "@/components/layout/Loader";
import { toast } from "sonner";
import ErrorComponent from "@/components/layout/Error";

export default function ServingsForm({
  foodSearchItem,
  clearFoodItem,
  onSelectServing,
}: {
  foodSearchItem: FoodSearchItem;
  clearFoodItem: () => void;
  onSelectServing: (mealEntryData: MealEntryData) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [foodData, setFoodData] = useState<null | FoodImportData>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedServingId, setSelectedServingId] = useState("");
  const [amount, setAmount] = useState("1");

  useEffect(() => {
    async function getSearchResults() {
      setIsLoading(true);
      const result = await getFoodDetails(foodSearchItem.slug);

      if (result.success) {
        setFoodData(result.data);
      } else {
        setErrorMessage(result.error);
      }
      setIsLoading(false);
    }
    getSearchResults();
  }, [foodSearchItem.slug]);

  const addFood = () => {
    if (!foodData) return;
    if (Number(amount) < 1) {
      return toast.error("Amount must be more than zero");
    }
    const selectedServing = foodData.servings.find(
      (s) => s.externalId === selectedServingId,
    );
    onSelectServing({
      foodImportData: foodData,
      mealEntryInput: {
        amountInGrams: selectedServing
          ? Number(selectedServing.amountInGrams) * Number(amount)
          : Number(amount),
        food: {
          externalId: foodData.food.externalId,
          externalSource: foodData.food.externalSource,
        },
        serving: selectedServing
          ? {
              externalId: selectedServingId,
              label: selectedServing.label,
            }
          : null,
        servingQuantity: selectedServing ? Number(amount) : null,
      },
    });
  };
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" onClick={clearFoodItem}>
          <ArrowLeft />
        </Button>
        <h3 className="text-lg">Add Serving</h3>
      </div>

      {isLoading && <Loader />}
      {!!errorMessage && <ErrorComponent message={errorMessage} />}
      <div className={isLoading || !!errorMessage ? "mt-2" : ""}>
        <h4 className="mb-2">{foodSearchItem.name}</h4>
        {!!foodData && (
          <div className="flex flex-col gap-2 overflow-y-scroll max-h-75">
            {foodData?.servings.map((serving) => (
              <Button
                variant={
                  serving.externalId === selectedServingId
                    ? "default"
                    : "outline"
                }
                key={serving.label}
                onClick={() => setSelectedServingId(serving.externalId)}
              >
                {serving.label.split(",")[0]}
              </Button>
            ))}
            <Button
              variant={selectedServingId === "" ? "default" : "outline"}
              onClick={() => setSelectedServingId("")}
            >
              Grams
            </Button>
          </div>
        )}
        <div className="flex gap-4 mt-4">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={addFood} disabled={isLoading}>
            Add Food
          </Button>
        </div>
      </div>
    </div>
  );
}
