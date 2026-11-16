"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveOnboarding } from "../actions";
import {
  createOnboardingDraft,
  ONBOARDING_STORAGE_KEY,
  parseOnboardingDraft,
} from "../draft";
import { onboardingInputSchema, type OnboardingInput } from "../schemas";
import OnboardingNavigation from "./OnboardingNavigation";
import OnboardingProgress from "./OnboardingProgress";
import OnboardingStepContent from "./OnboardingStepContent";
import { onboardingSteps } from "./onboarding-steps";

type OnboardingWizardProps = {
  authenticated: boolean;
  initialValue?: OnboardingInput;
  onSaved?: () => void;
};

export default function OnboardingWizard({
  authenticated,
  initialValue,
  onSaved,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(initialValue ? 1 : 0);
  const [value, setValue] = useState<OnboardingInput>(
    initialValue ?? createOnboardingDraft(),
  );
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const stepCopy = onboardingSteps[step];

  useEffect(() => {
    if (initialValue) return;

    const timeout = window.setTimeout(() => {
      const stored = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
      const parsed = parseOnboardingDraft(stored);

      setValue((current) => ({
        ...(parsed ?? current),
        timezone:
          Intl.DateTimeFormat().resolvedOptions().timeZone || current.timezone,
      }));
    });

    return () => window.clearTimeout(timeout);
  }, [initialValue]);

  useEffect(() => {
    if (initialValue) return;
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(value));
  }, [initialValue, value]);

  function updateValue(patch: Partial<OnboardingInput>) {
    setValue((current) => ({ ...current, ...patch }));
  }

  function moveToStep(nextStep: number) {
    setError("");
    setStep(nextStep);
  }

  async function finish() {
    const parsed = onboardingInputSchema.safeParse(value);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Review your answers.");
      return;
    }

    if (!authenticated) {
      router.push("/register?onboarding=1");
      return;
    }

    setPending(true);
    const result = await saveOnboarding(parsed.data);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    toast.success("Nutrition plan saved");

    if (onSaved) {
      onSaved();
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      <OnboardingProgress currentStep={step} steps={onboardingSteps.length} />
      <p className="text-sm text-muted-foreground">
        Step {step + 1} of {onboardingSteps.length}
      </p>
      <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight md:text-6xl">
        {stepCopy.title}
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {stepCopy.description}
      </p>
      <div className="mt-8">
        <OnboardingStepContent
          step={step}
          value={value}
          onChange={updateValue}
        />
      </div>
      {error && (
        <p
          className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
      <OnboardingNavigation
        step={step}
        stepCount={onboardingSteps.length}
        authenticated={authenticated}
        pending={pending}
        backAction={() => moveToStep(step - 1)}
        continueAction={() => moveToStep(step + 1)}
        finishAction={finish}
      />
    </section>
  );
}
