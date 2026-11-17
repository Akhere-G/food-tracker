import Skeleton from "@/components/ui/skeleton";

export default function PeriodControlsSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
      <Skeleton className="h-11 w-64 max-w-full" />
      <Skeleton className="h-10 w-64 max-w-full" />
    </div>
  );
}
