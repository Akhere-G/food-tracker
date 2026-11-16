"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Soup } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { saveOnboarding } from "../actions";
import { createOnboardingDraft, ONBOARDING_STORAGE_KEY, parseOnboardingDraft } from "../draft";
import { onboardingInputSchema, type OnboardingInput } from "../schemas";
import { BodyFields, GoalFields, JourneyFields } from "./OnboardingFields";
import PlanSummary from "./PlanSummary";

const stepCopy = [
  { title: "Let’s build something you can return to", description: "A personal plan for steady, sustainable change. About five minutes." },
  { title: "Let’s get your body basics", description: "These details help estimate your daily energy needs." },
  { title: "Set your goal and pace", description: "Choose what feels realistic. You can change it later." },
  { title: "Tell us what the journey has felt like", description: "There is no wrong answer and these answers never score your progress." },
  { title: "Your plan is ready", description: "Review the estimate before saving it." },
] as const;

export default function OnboardingWizard({ authenticated, initialValue, onSaved }: { authenticated: boolean; initialValue?: OnboardingInput; onSaved?: () => void }) {
  const [step, setStep] = useState(initialValue ? 1 : 0);
  const [value, setValue] = useState<OnboardingInput>(initialValue ?? createOnboardingDraft());
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

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
    if (!initialValue) window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(value));
  }, [initialValue, value]);

  const update = (patch: Partial<OnboardingInput>) => setValue((current) => ({ ...current, ...patch }));

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
    if (onSaved) onSaved();
    else router.push("/dashboard");
  }

  const content = step === 0 ? <Welcome /> : step === 1 ? <BodyFields value={value} onChange={update} /> : step === 2 ? <GoalFields value={value} onChange={update} /> : step === 3 ? <JourneyFields value={value} onChange={update} /> : <PlanSummary value={value} />;

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="mb-8 flex gap-2" aria-label={`Step ${step + 1} of ${stepCopy.length}`}>
        {stepCopy.map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-primary" : "bg-muted"}`} />)}
      </div>
      <p className="text-sm text-muted-foreground">Step {step + 1} of {stepCopy.length}</p>
      <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight md:text-6xl">{stepCopy[step].title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{stepCopy[step].description}</p>
      <div className="mt-8">{content}</div>
      {error && <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p>}
      <div className="mt-10 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
        <Button variant="outline" size="lg" disabled={step === 0 || pending} onClick={() => { setError(""); setStep((current) => current - 1); }}><ArrowLeft /> Back</Button>
        {step < stepCopy.length - 1 ? <Button size="lg" onClick={() => { setError(""); setStep((current) => current + 1); }}>Continue <ArrowRight /></Button> : <Button size="lg" disabled={pending} onClick={finish}>{pending ? "Saving…" : authenticated ? "Save my plan" : "Create my account"}</Button>}
      </div>
    </section>
  );
}

function Welcome() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4 text-lg leading-relaxed"><p>FoodTracker starts with your real life, not a perfect week.</p><p>Your guest answers stay in this browser until you create an account.</p></div>
      <div className="flex min-h-48 items-center justify-center rounded-xl bg-accent"><Soup aria-hidden="true" className="size-24 text-primary" /></div>
    </div>
  );
}
