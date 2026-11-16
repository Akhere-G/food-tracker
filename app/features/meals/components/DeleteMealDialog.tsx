import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteMealDialogProps = {
  open: boolean;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  deleteAction: () => void;
};

export default function DeleteMealDialog({
  open,
  pending,
  onOpenChange,
  deleteAction,
}: DeleteMealDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this meal?</DialogTitle>
          <DialogDescription>
            This removes the complete meal and every food entry in it. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={deleteAction}
          >
            {pending ? "Deleting…" : "Delete meal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
