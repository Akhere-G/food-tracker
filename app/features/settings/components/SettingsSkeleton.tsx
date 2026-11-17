import FormFieldsSkeleton from "@/components/layout/loading/FormFieldsSkeleton";
import PageHeaderSkeleton from "@/components/layout/loading/PageHeaderSkeleton";
import LoadingRegion from "@/components/ui/LoadingRegion";
import Skeleton from "@/components/ui/skeleton";

export default function SettingsSkeleton() {
  return (
    <LoadingRegion label="Loading your settings…" className="page-shell max-w-5xl">
      <PageHeaderSkeleton description />
      <div className="mt-8 space-y-10">
        <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:justify-between">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-5/6" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="space-y-5 border-t pt-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-12 w-60 max-w-full" />
          <Skeleton className="h-5 w-20" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-12 w-24" />)}
          </div>
        </div>
        <div className="space-y-5 border-t pt-6">
          <Skeleton className="h-8 w-24" />
          <div className="grid gap-5 sm:grid-cols-3">
            {[0, 1, 2].map((index) => <FormFieldsSkeleton key={index} fields={1} />)}
          </div>
        </div>
        <div className="space-y-5 border-t pt-6">
          <Skeleton className="h-8 w-40" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-14 w-full" />)}
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="space-y-5 border-t pt-6">
          <Skeleton className="h-8 w-40" />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormFieldsSkeleton fields={1} />
            <FormFieldsSkeleton fields={1} />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4 border-t pt-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </LoadingRegion>
  );
}
