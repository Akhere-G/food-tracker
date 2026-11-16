import { Soup } from "lucide-react";
import type { OnboardingInput } from "../schemas";
import {
  BodyFields,
  GoalFields,
  JourneyFields,
  NutritionPriorityFields,
} from "./OnboardingFields";
import PlanSummary from "./PlanSummary";

type OnboardingStepContentProps = {
  step: number;
  value: OnboardingInput;
  onChange: (patch: Partial<OnboardingInput>) => void;
};

export default function OnboardingStepContent({
  step,
  value,
  onChange,
}: OnboardingStepContentProps) {
  switch (step) {
    case 0:
      return <Welcome />;
    case 1:
      return <BodyFields value={value} onChange={onChange} />;
    case 2:
      return <GoalFields value={value} onChange={onChange} />;
    case 3:
      return <JourneyFields value={value} onChange={onChange} />;
    case 4:
      return <NutritionPriorityFields value={value} onChange={onChange} />;
    default:
      return <PlanSummary value={value} />;
  }
}

function Welcome() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4 text-lg leading-relaxed">
        <p>FoodTracker starts with your real life, not a perfect week.</p>
        <p>
          Your guest answers stay in this browser until you create an account.
        </p>
      </div>
      <div className="flex min-h-48 items-center justify-center rounded-xl bg-accent">
        <Soup aria-hidden="true" className="size-24 text-primary" />
      </div>
    </div>
  );
}
