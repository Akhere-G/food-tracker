import { getNutrientColour } from "../../food/utils";

interface NutrientTotalProps {
  nutrientTotal: {
    name: string;
    unit: string;
    amount: number;
    dailyMax: number;
  };
}
import { Progress } from "@/components/ui/progress";

export default function NutrientTotal({ nutrientTotal }: NutrientTotalProps) {
  const { name, amount, unit, dailyMax } = nutrientTotal;
  return (
    <div className="flex flex-col gap-2 items-center justify-center flex-1 px-4">
      <p>{name}</p>
      <Progress
        value={(amount / dailyMax) * 100}
        className="min-w-20 max-w-70 w-full "
        indicatorColor={getNutrientColour(name)}
      />
      {amount.toFixed(2)} / {dailyMax} {unit}
    </div>
  );
}
