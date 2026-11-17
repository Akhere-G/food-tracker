import type { EnergyUnit } from "@/app/features/settings/units";
import { saveMeal } from "../actions";
import MealEditor from "./MealEditor";

type AddMealFormProps = {
  initialDate: string;
  initialTime: string;
  energyUnit?: EnergyUnit;
  timezone: string;
};

export default function AddMealForm(props: AddMealFormProps) {
  return (
    <MealEditor
      {...props}
      title="Add meal"
      submitLabel="Save meal"
      successMessage="Meal added"
      summaryLabel="This meal — not saved yet"
      submitAction={saveMeal}
      resetEntriesAfterSubmit
    />
  );
}
