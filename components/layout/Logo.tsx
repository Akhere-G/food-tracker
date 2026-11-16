import { Soup } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-heading text-xl font-semibold tracking-tight",
        className,
      )}
    >
      <Soup aria-hidden="true" className="size-7 text-primary" />
      <span>FoodTracker</span>
    </Link>
  );
}
