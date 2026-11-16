type MealEditorHeaderProps = {
  title: string;
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
};

export default function MealEditorHeader({
  title,
  date,
  time,
  onDateChange,
  onTimeChange,
}: MealEditorHeaderProps) {
  return (
    <header>
      <p className="text-sm font-medium text-primary">Meals</p>
      <h1 className="title mt-1">{title}</h1>
      <div className="mt-6 flex flex-wrap gap-4 border-b pb-6">
        <label className="grid gap-2 text-sm font-medium">
          Date
          <input
            className="h-11 rounded-lg border bg-background px-3 text-base"
            type="date"
            required
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Eaten at
          <input
            className="h-11 rounded-lg border bg-background px-3 text-base"
            type="time"
            required
            value={time}
            onChange={(event) => onTimeChange(event.target.value)}
          />
        </label>
      </div>
    </header>
  );
}
