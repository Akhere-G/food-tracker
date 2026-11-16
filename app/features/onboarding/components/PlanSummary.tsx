import { formatDate } from "date-fns";
import type { OnboardingInput } from "../schemas";
import { calculateNutritionPlan } from "../nutrition-plan";

export default function PlanSummary({ value }: { value: OnboardingInput }) {
  const plan = calculateNutritionPlan(value);
  const targetDate = plan.targetDate
    ? formatDate(new Date(`${plan.targetDate}T12:00:00`), "d MMMM yyyy")
    : "Ongoing";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div>
        <p className="text-sm font-medium text-primary">Your plan is ready</p>
        <h2 className="mt-2 font-heading text-4xl font-semibold">
          A steady target built around your life.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          This is an estimate, not a medical prescription. You can revisit every
          answer from Settings as your circumstances change.
        </p>
        <dl className="mt-8 grid gap-4 border-y py-6 sm:grid-cols-2">
          <SummaryTerm label="Daily energy" value={`${plan.dailyCalories.toLocaleString("en-GB")} kcal`} />
          <SummaryTerm label="Estimated target date" value={targetDate} />
          <SummaryTerm label="Protein" value={`${plan.dailyProteinGrams} g`} />
          <SummaryTerm label="Carbohydrate" value={`${plan.dailyCarbohydrateGrams} g`} />
          <SummaryTerm label="Fat" value={`${plan.dailyFatGrams} g`} />
          <SummaryTerm label="Planned weekly pace" value={`${plan.plannedWeeklyChangeKg} kg`} />
        </dl>
      </div>
      <aside className="rounded-xl bg-accent p-6 text-accent-foreground">
        <p className="font-heading text-2xl font-semibold">What we heard</p>
        <p className="mt-4 leading-relaxed">
          You are not failing a plan. The plan needs to fit you. Returning after
          a difficult day still counts as progress.
        </p>
      </aside>
    </div>
  );
}

function SummaryTerm({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-heading text-2xl font-semibold tabular-nums">
        {value}
      </dd>
    </div>
  );
}
