import LedgerRowsSkeleton from "@/components/layout/loading/LedgerRowsSkeleton";
import MetricsSkeleton from "@/components/layout/loading/MetricsSkeleton";
import PageHeaderSkeleton from "@/components/layout/loading/PageHeaderSkeleton";
import LoadingRegion from "@/components/ui/LoadingRegion";
import Skeleton from "@/components/ui/skeleton";

export default function MealsSkeleton() {
  return (
    <LoadingRegion label="Loading your meals…" className="page-shell">
      <PageHeaderSkeleton action />
      <div className="mt-5 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }, (_, index) => <Skeleton key={index} className="h-17 w-full" />)}
      </div>
      <div className="mt-6"><MetricsSkeleton /></div>
      <div className="mt-8 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>
        {[0, 1].map((index) => (
          <div key={index} className="rounded-xl border bg-card">
            <div className="border-b bg-muted/40 px-4 py-3"><Skeleton className="h-8 w-20" /></div>
            <div className="px-4"><LedgerRowsSkeleton rows={2} /></div>
          </div>
        ))}
      </div>
    </LoadingRegion>
  );
}
