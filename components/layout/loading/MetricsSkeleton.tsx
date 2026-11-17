import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function MetricsSkeleton({ count = 4 }: { count?: 2 | 3 | 4 }) {
  return (
    <div className={cn(
      "grid gap-6 border-y py-6",
      count === 2 && "md:grid-cols-2",
      count === 3 && "sm:grid-cols-3",
      count === 4 && "sm:grid-cols-2 xl:grid-cols-4",
    )}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="space-y-4 py-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className={cn("w-40 max-w-full", count === 2 ? "h-15" : "h-9")} />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}
