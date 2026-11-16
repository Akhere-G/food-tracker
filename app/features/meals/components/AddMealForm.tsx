import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MealForm from "./MealForm";
import { MealEntryData } from "../types";

interface AddMealFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addEntry: (entry: MealEntryData) => void;
}
export default function AddMealForm({
  isOpen,
  setIsOpen,
  addEntry,
}: AddMealFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Add food</DialogTitle>
        </DialogHeader>
        <MealForm sumbitAction={addEntry} closeForm={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
