import type { EnergyUnit } from "@/app/features/settings/units";
import { deleteMeal, replaceMeal } from "../actions";
import type { MealEntryData } from "../types";
import MealEditor from "./MealEditor";

type UpdateMealFormProps = {
  mealId: string;
  initialEntries: MealEntryData[];
  initialDate: string;
  initialTime: string;
  energyUnit?: EnergyUnit;
  timezone: string;
};

export default function UpdateMealForm({
  mealId,
  ...props
}: UpdateMealFormProps) {
  return (
    <MealEditor
      {...props}
      title="Update meal"
      submitLabel="Save changes"
      successMessage="Changes saved"
      summaryLabel="Updated meal preview"
      helperText="Saving replaces this meal with the foods and time shown here."
      submitAction={replaceMeal.bind(null, mealId)}
      deleteAction={deleteMeal.bind(null, mealId)}
    />
  );
}
