"use client";

import { Input } from "@/components/ui/input";
import type { OnboardingInput } from "../schemas";
import {
  ACTIVITY_LEVELS,
  CHALLENGES,
  JOURNEY_FEELINGS,
  NUTRITION_PRIORITIES,
  SEX_OPTIONS,
  WEEKLY_CHANGE_OPTIONS,
} from "../constants";

type Props = {
  value: OnboardingInput;
  onChange: (patch: Partial<OnboardingInput>) => void;
};

const labels: Record<string, string> = {
  female: "Female",
  male: "Male",
  intersex: "Intersex",
  prefer_not_to_say: "Prefer not to say",
  sedentary: "Not very active",
  light: "Lightly active",
  moderate: "Active most days",
  active: "Very active",
  very_active: "Highly active",
  hopeful: "Hopeful",
  tired_of_starting_over: "Tired of starting over",
  unsure: "Unsure",
  ready_for_change: "Ready for a change",
  one_day_at_a_time: "Taking it one day at a time",
  momentum: "I start strong, then lose momentum",
  stress: "Stress changes how I eat",
  time: "I do not have much time",
  strict_plans: "Plans have felt too strict",
  uncertainty: "I am not sure what works for me",
  other: "Something else",
  balanced: "Keep the whole picture balanced",
  reduce_sodium: "Keep sodium in check",
  more_fibre: "Get more fibre",
  support_bones: "Support bone health",
  support_energy: "Support everyday energy",
};

export function BodyFields({ value, onChange }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Date of birth">
        <Input type="date" value={value.dateOfBirth} onChange={(event) => onChange({ dateOfBirth: event.target.value })} />
      </Field>
      <Field label="Height (cm)">
        <Input type="number" min="120" max="230" value={value.heightCm} onChange={(event) => onChange({ heightCm: Number(event.target.value) })} />
      </Field>
      <Field label="Current weight (kg)">
        <Input type="number" min="35" max="350" step="0.1" value={value.currentWeightKg} onChange={(event) => onChange({ currentWeightKg: Number(event.target.value) })} />
      </Field>
      <Field label="Sex used for the metabolic estimate" hint="This selects the estimate equation only.">
        <Select value={value.sex} options={SEX_OPTIONS} onChange={(sex) => onChange({ sex: sex as OnboardingInput["sex"] })} />
      </Field>
      <Field label="Gender identity (optional)">
        <Input value={value.genderIdentity ?? ""} placeholder="Prefer not to say" onChange={(event) => onChange({ genderIdentity: event.target.value || null })} />
      </Field>
      <Field label="Baseline activity">
        <Select value={value.activityLevel} options={ACTIVITY_LEVELS} onChange={(activityLevel) => onChange({ activityLevel: activityLevel as OnboardingInput["activityLevel"] })} />
      </Field>
    </div>
  );
}

export function GoalFields({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {(["lose", "maintain", "gain"] as const).map((goal) => (
          <Choice key={goal} selected={value.goal === goal} onClick={() => onChange({ goal, requestedWeeklyChangeKg: goal === "maintain" ? 0 : value.requestedWeeklyChangeKg })}>
            {goal === "lose" ? "Lose weight" : goal === "gain" ? "Gain weight" : "Maintain weight"}
          </Choice>
        ))}
      </div>
      <Field label="Dream weight (kg)">
        <Input type="number" min="35" max="350" step="0.1" value={value.targetWeightKg} onChange={(event) => onChange({ targetWeightKg: Number(event.target.value) })} />
      </Field>
      {value.goal !== "maintain" && (
        <fieldset>
          <legend className="font-medium">Desired weekly change</legend>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the pace you want to work towards. You can change it later.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {WEEKLY_CHANGE_OPTIONS.map((rate) => (
              <Choice key={rate} selected={value.requestedWeeklyChangeKg === rate} onClick={() => onChange({ requestedWeeklyChangeKg: rate })}>{rate} kg</Choice>
            ))}
          </div>
          {value.requestedWeeklyChangeKg > 1 && (
            <p className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm" role="status">
              This is an aggressive weekly target and may be difficult or unsafe for some people. Consider speaking with a healthcare professional before pursuing it.
            </p>
          )}
        </fieldset>
      )}
    </div>
  );
}

export function JourneyFields({ value, onChange }: Props) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <ChoiceGroup title="How are you feeling about your journey right now?" options={JOURNEY_FEELINGS} selected={value.journeyFeeling} onSelect={(journeyFeeling) => onChange({ journeyFeeling: journeyFeeling as OnboardingInput["journeyFeeling"] })} />
      <div className="space-y-8">
        <ChoiceGroup title="What has made this feel difficult before?" options={CHALLENGES} selected={value.biggestChallenge} onSelect={(biggestChallenge) => onChange({ biggestChallenge: biggestChallenge as OnboardingInput["biggestChallenge"] })} />
        <Field label="What have you tried before?" hint="Optional. Separate a few approaches with commas.">
          <Input
            value={value.previousAttempts.join(", ")}
            placeholder="Calorie counting, meal plans, gym challenges"
            onChange={(event) => onChange({
              previousAttempts: event.target.value
                .split(",")
                .map((attempt) => attempt.trim())
                .filter(Boolean)
                .slice(0, 8),
            })}
          />
        </Field>
      </div>
    </div>
  );
}

export function NutritionPriorityFields({ value, onChange }: Props) {
  function togglePriority(priority: OnboardingInput["nutritionPriorities"][number]) {
    if (priority === "balanced") {
      onChange({ nutritionPriorities: ["balanced"] });
      return;
    }

    const current = value.nutritionPriorities.filter(
      (item) => item !== "balanced",
    );
    const selected = current.includes(priority);
    const next = selected
      ? current.filter((item) => item !== priority)
      : [...current, priority].slice(0, 3);
    onChange({ nutritionPriorities: next.length ? next : ["balanced"] });
  }

  return (
    <fieldset>
      <legend className="font-heading text-2xl font-semibold">
        What would you like us to gently prioritise?
      </legend>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Choose up to three. We use these to emphasise useful guidance, not to
        grade your meals.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {NUTRITION_PRIORITIES.map((priority) => (
          <Choice
            key={priority}
            selected={value.nutritionPriorities.includes(priority)}
            onClick={() => togglePriority(priority)}
          >
            {labels[priority]}
          </Choice>
        ))}
      </div>
    </fieldset>
  );
}

function ChoiceGroup({ title, options, selected, onSelect }: { title: string; options: readonly string[]; selected: string; onSelect: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="font-heading text-2xl font-semibold">{title}</legend>
      <div className="mt-4 grid gap-2">
        {options.map((option) => <Choice key={option} selected={selected === option} onClick={() => onSelect(option)}>{labels[option]}</Choice>)}
      </div>
    </fieldset>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="grid gap-2 font-medium">{label}{children}{hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}</label>;
}

function Select({ value, options, onChange }: { value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <select className="h-11 rounded-lg border bg-background px-3 text-base" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{labels[option]}</option>)}</select>;
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`min-h-12 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${selected ? "border-primary bg-accent text-accent-foreground" : "bg-card hover:bg-muted"}`}>{children}</button>;
}
