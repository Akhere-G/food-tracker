"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  nutritionPickerAnchor,
  type NutritionPeriod,
} from "../period";

type PeriodPickerProps = {
  period: NutritionPeriod;
  value: string;
  label: string;
  nutrient: string;
};

export default function PeriodPicker({
  period,
  value,
  label,
  nutrient,
}: PeriodPickerProps) {
  const [open, setOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const [error, setError] = useState("");
  const router = useRouter();
  const inputType = period === "year" ? "number" : period;

  function changeOpen(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setDraftValue(value);
      setError("");
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const anchor = nutritionPickerAnchor(period, draftValue);
    if (!anchor) {
      setError(`Choose a valid ${period}.`);
      return;
    }

    const query = new URLSearchParams({ period, date: anchor, nutrient });
    setOpen(false);
    router.push(`/nutrition?${query.toString()}`);
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex min-h-11 min-w-0 max-w-sm flex-1 items-center justify-center gap-2 rounded-lg px-2 font-medium hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none lg:flex-none lg:px-5"
            aria-label={`Choose ${period}: ${label}`}
          />
        }
      >
        <CalendarDays
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
        <span className="truncate">{label}</span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Choose a {period}</DialogTitle>
          <DialogDescription>
            The nutrition report will update to the {period} you select.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-5" onSubmit={submit}>
          <label className="grid gap-2 font-medium capitalize">
            {period}
            <Input
              autoFocus
              aria-invalid={Boolean(error)}
              type={inputType}
              value={draftValue}
              min={period === "year" ? "2000" : undefined}
              max={period === "year" ? "2100" : undefined}
              onChange={(event) => setDraftValue(event.target.value)}
            />
          </label>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <DialogFooter showCloseButton>
            <Button type="submit">View {period}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
