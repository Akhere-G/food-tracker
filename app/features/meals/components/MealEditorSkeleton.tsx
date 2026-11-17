import LedgerRowsSkeleton from "@/components/layout/loading/LedgerRowsSkeleton";
import LoadingRegion from "@/components/ui/LoadingRegion";
import Skeleton from "@/components/ui/skeleton";

export default function MealEditorSkeleton({ editing = false }: { editing?: boolean }) {
  return (
    <LoadingRegion label={editing ? "Loading your meal…" : "Preparing a new meal…"} className="page-shell">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="mt-1 h-10 w-64 max-w-full md:h-15" />
      <div className="mt-6 flex flex-wrap gap-4 border-b pb-6">
        {[0, 1].map((index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-11 w-40" />
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <div className="flex flex-wrap justify-between gap-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-9 w-28" />
          </div>
          {editing ? <LedgerRowsSkeleton rows={2} /> : <Skeleton className="mt-5 h-40 w-full" />}
        </div>
        <div className="space-y-4 rounded-xl bg-accent p-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-12 w-40" />
          <LedgerRowsSkeleton />
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>
    </LoadingRegion>
  );
}
