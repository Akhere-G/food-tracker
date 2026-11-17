import LedgerRowsSkeleton from "@/components/layout/loading/LedgerRowsSkeleton";
import PageHeaderSkeleton from "@/components/layout/loading/PageHeaderSkeleton";
import PeriodControlsSkeleton from "@/components/layout/loading/PeriodControlsSkeleton";
import LoadingRegion from "@/components/ui/LoadingRegion";
import Skeleton from "@/components/ui/skeleton";

export default function NutritionSkeleton() {
  return (
    <LoadingRegion label="Loading nutrition detail…" className="page-shell">
      <PageHeaderSkeleton action description />
      <PeriodControlsSkeleton />
      <div className="grid border-b sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-2 border-b py-4 last:border-b-0 sm:border-b-0 sm:px-5 sm:first:pl-0">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-40 max-w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-14">
        <div className="order-2 border-t pt-8 lg:order-1 lg:border-t-0 lg:border-r lg:pr-12 lg:pt-0">
          <Skeleton className="h-7 w-48" />
          <LedgerRowsSkeleton rows={8} />
        </div>
        <div className="order-1 lg:order-2">
          <Skeleton className="h-5 w-32" />
          <div className="mt-2 flex justify-between gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="mt-8 h-56 w-full" />
          <Skeleton className="mt-5 h-24 w-full" />
          <div className="mt-8"><LedgerRowsSkeleton /></div>
        </div>
      </div>
    </LoadingRegion>
  );
}
