import { format } from "date-fns";
import type { NutritionProfile } from "@/db/profile-schema";
import {
  weightValue,
  type WeightUnit,
} from "@/app/features/settings/units";

export default function WeightDirection({
  profile,
  weightUnit,
}: {
  profile: NutritionProfile;
  weightUnit: WeightUnit;
}) {
  const currentWeight = weightValue(
    Number(profile.currentWeightKg),
    weightUnit,
  );
  const targetWeight = weightValue(
    Number(profile.targetWeightKg),
    weightUnit,
  );
  const targetDate = profile.targetDate
    ? format(new Date(`${profile.targetDate}T12:00:00`), "d MMMM yyyy")
    : null;

  return (
    <section className="lg:pl-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="section-heading">Weight direction</h2>
          <p className="data-number mt-2 text-4xl font-semibold">
            {currentWeight} {weightUnit}
          </p>
          <p className="text-sm text-muted-foreground">
            Goal {targetWeight} {weightUnit}
          </p>
        </div>
        {targetDate && (
          <p className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
            Estimated {targetDate}
          </p>
        )}
      </div>
      <div
        className="mt-10 flex items-center gap-3"
        aria-label={`From ${currentWeight} ${weightUnit} to ${targetWeight} ${weightUnit}`}
      >
        <span className="size-4 rounded-full bg-primary" />
        <span className="h-0.5 flex-1 border-t-2 border-dashed border-primary" />
        <span className="size-4 rounded-full border-4 border-primary bg-background" />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>Today</span>
        <span>Target</span>
      </div>
    </section>
  );
}
