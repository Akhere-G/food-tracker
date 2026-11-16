import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MealEntryData } from "../types";
import FoodPicker from "./FoodPicker";

type AddFoodDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addEntryAction: (entry: MealEntryData) => boolean;
};

export default function AddFoodDialog({
  open,
  onOpenChange,
  addEntryAction,
}: AddFoodDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Add food</DialogTitle>
        </DialogHeader>
        <FoodPicker
          submitAction={addEntryAction}
          closeAction={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
