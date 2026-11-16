export default function ProgressEncouragement({
  loggedDays,
}: {
  loggedDays: number;
}) {
  const message = loggedDays
    ? `${loggedDays} logged ${loggedDays === 1 ? "day" : "days"} — consistency is building.`
    : "Your next meal is a fresh start.";

  return (
    <aside className="border-l-4 border-primary pl-6">
      <p className="font-heading text-3xl font-semibold italic">{message}</p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Progress is information, not a verdict. Your average and totals update
        as meals are logged.
      </p>
    </aside>
  );
}
