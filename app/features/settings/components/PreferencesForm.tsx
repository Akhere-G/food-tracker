"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { updatePreferences } from "@/app/features/onboarding/actions";
import type { PreferencesInput } from "@/app/features/onboarding/schemas";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const colorThemes = ["cranberry", "ocean", "forest", "amber", "plum"] as const;

export default function PreferencesForm({ initialValue }: { initialValue: PreferencesInput }) {
  const [value, setValue] = useState(initialValue);
  const [pending, setPending] = useState(false);
  const { setTheme } = useTheme();
  const update = (patch: Partial<PreferencesInput>) => setValue((current) => ({ ...current, ...patch }));

  async function save() {
    setPending(true);
    const result = await updatePreferences(value);
    setPending(false);
    if (!result.success) return toast.error(result.error);
    setTheme(value.themeMode);
    document.documentElement.dataset.colorTheme = value.colorTheme;
    toast.success("Settings saved");
  }

  return (
    <div className="space-y-10">
      <SettingsSection title="Appearance" description="Choose a mode and one of five warm, readable colour accents.">
        <Field label="Theme">
          <Segmented options={["system", "light", "dark"]} value={value.themeMode} onChange={(themeMode) => update({ themeMode: themeMode as PreferencesInput["themeMode"] })} />
        </Field>
        <Field label="Colour">
          <div className="flex flex-wrap gap-3">
            {colorThemes.map((colorTheme) => <button key={colorTheme} type="button" aria-pressed={value.colorTheme === colorTheme} onClick={() => update({ colorTheme })} className={`rounded-lg border px-4 py-3 capitalize ${value.colorTheme === colorTheme ? "border-primary bg-accent" : "hover:bg-muted"}`}>{colorTheme}</button>)}
          </div>
        </Field>
      </SettingsSection>
      <SettingsSection title="Units" description="Your stored nutrition profile stays metric; these control how values are displayed.">
        <div className="grid gap-5 sm:grid-cols-3">
          <Select label="Weight" value={value.weightUnit} options={["kg", "lb"]} onChange={(weightUnit) => update({ weightUnit: weightUnit as PreferencesInput["weightUnit"] })} />
          <Select label="Height" value={value.heightUnit} options={["cm", "ft-in"]} onChange={(heightUnit) => update({ heightUnit: heightUnit as PreferencesInput["heightUnit"] })} />
          <Select label="Energy" value={value.energyUnit} options={["kcal", "kj"]} onChange={(energyUnit) => update({ energyUnit: energyUnit as PreferencesInput["energyUnit"] })} />
        </div>
      </SettingsSection>
      <SettingsSection title="Notifications" description="Save your preferences now. Delivery will be added in a future release.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="Meal reminders" checked={value.mealReminders} onChange={(mealReminders) => update({ mealReminders })} />
          <Toggle label="Daily check-in" checked={value.dailyReminder} onChange={(dailyReminder) => update({ dailyReminder })} />
          <Toggle label="Weekly summary" checked={value.weeklySummary} onChange={(weeklySummary) => update({ weeklySummary })} />
          <Toggle label="Goal milestones" checked={value.goalMilestones} onChange={(goalMilestones) => update({ goalMilestones })} />
          <Toggle label="Product updates" checked={value.productUpdates} onChange={(productUpdates) => update({ productUpdates })} />
        </div>
      </SettingsSection>
      <Button size="lg" disabled={pending} onClick={save}>{pending ? "Saving…" : "Save settings"}</Button>
    </div>
  );
}

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="border-t pt-6"><h2 className="section-heading">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p><div className="mt-5 space-y-5">{children}</div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="mb-2 text-sm font-medium">{label}</p>{children}</div>;
}

function Segmented({ options, value, onChange }: { options: readonly string[]; value: string; onChange: (value: string) => void }) {
  return <div className="inline-flex rounded-lg border p-1">{options.map((option) => <button key={option} type="button" onClick={() => onChange(option)} className={`rounded-md px-4 py-2 text-sm capitalize ${value === option ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{option}</button>)}</div>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-sm font-medium">{label}<select className="h-11 rounded-lg border bg-background px-3" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center gap-3 rounded-lg border p-4"><Checkbox checked={checked} onCheckedChange={(next) => onChange(next === true)} /><span className="font-medium">{label}</span></label>;
}
