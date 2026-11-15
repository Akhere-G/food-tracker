import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MealForm from "./MealForm";

interface AddMealFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export default function AddMealForm({ isOpen, setIsOpen }: AddMealFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Meal</DialogTitle>
        </DialogHeader>
        <MealForm />
      </DialogContent>
    </Dialog>
  );
}
