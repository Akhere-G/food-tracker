import { format } from "date-fns";
import MealEditor from "@/app/features/meals/components/MealEditor";

export default async function AddMealPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; time?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const initialDate = /^\d{4}-\d{2}-\d{2}$/.test(params.date ?? "")
    ? params.date!
    : format(now, "yyyy-MM-dd");
  const initialTime = /^\d{2}:\d{2}$/.test(params.time ?? "")
    ? params.time!
    : format(now, "HH:mm");

  return (
    <MealEditor
      mode="add"
      initialDate={initialDate}
      initialTime={initialTime}
    />
  );
}
