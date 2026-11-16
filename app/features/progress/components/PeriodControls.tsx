import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ProgressPeriod } from "../period";
import { cn } from "@/lib/utils";

export default function PeriodControls({
  period,
  label,
  previous,
  next,
}: {
  period: ProgressPeriod;
  label: string;
  previous: string;
  next: string;
}) {
  const dateHref = (date: string) => `/dashboard?period=${period}&date=${date}`;
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="inline-flex w-fit rounded-lg border p-1">
        {(["week", "month", "year"] as const).map((item) => (
          <Link
            key={item}
            href={`/dashboard?period=${item}`}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium capitalize",
              item === period ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            {item}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Link className="rounded-lg p-2 hover:bg-muted" href={dateHref(previous)} aria-label={`Previous ${period}`}><ChevronLeft /></Link>
        <p className="min-w-48 text-center font-medium">{label}</p>
        <Link className="rounded-lg p-2 hover:bg-muted" href={dateHref(next)} aria-label={`Next ${period}`}><ChevronRight /></Link>
      </div>
    </div>
  );
}
