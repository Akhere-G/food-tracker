import LedgerRowsSkeleton from "@/components/layout/loading/LedgerRowsSkeleton";
import MetricsSkeleton from "@/components/layout/loading/MetricsSkeleton";
import PageHeaderSkeleton from "@/components/layout/loading/PageHeaderSkeleton";
import PeriodControlsSkeleton from "@/components/layout/loading/PeriodControlsSkeleton";
import LoadingRegion from "@/components/ui/LoadingRegion";
import Skeleton from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <LoadingRegion label="Loading your overview…" className="page-shell">
      <PageHeaderSkeleton action />
      <PeriodControlsSkeleton />
      <MetricsSkeleton count={2} />
      <div className="grid gap-8 border-b py-7 lg:grid-cols-[1fr_1.15fr] lg:divide-x">
        <div>
          <Skeleton className="h-8 w-48" />
          <LedgerRowsSkeleton />
        </div>
        <div className="space-y-5 lg:pl-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
      <div className="grid gap-8 py-7 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-5">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-52 w-full" />
        </div>
        <Skeleton className="h-52 w-full" />
      </div>
    </LoadingRegion>
  );
}
