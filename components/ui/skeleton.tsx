import { cn } from "@/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-slot="skeleton"
      className={cn(
        "h-4 rounded-md bg-border motion-safe:animate-pulse motion-reduce:animate-none",
        className,
      )}
    />
  );
}
