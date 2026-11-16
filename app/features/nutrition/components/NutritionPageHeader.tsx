import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NutritionPageHeader() {
  return (
    <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">Nutrition insight</p>
        <h1 className="title mt-1">Nutrition detail</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          A closer look at your nutrients, with helpful trends and sources.
        </p>
      </div>
      <Link
        href="/settings"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-fit")}
      >
        <SlidersHorizontal aria-hidden="true" /> Adjust goals
      </Link>
    </header>
  );
}
