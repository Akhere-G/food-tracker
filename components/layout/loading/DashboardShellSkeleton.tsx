import LoadingRegion from "@/components/ui/LoadingRegion";
import Skeleton from "@/components/ui/skeleton";
import PageHeaderSkeleton from "./PageHeaderSkeleton";

export default function DashboardShellSkeleton() {
  return (
    <LoadingRegion label="Loading your account…">
      <div className="min-h-dvh md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="hidden border-r bg-sidebar px-4 py-7 md:block">
          <Skeleton className="h-8 w-40" />
          <div className="mt-12 space-y-2">
            {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-12 w-full" />)}
          </div>
        </div>
        <div className="min-w-0 pb-20 md:pb-0">
          <div className="page-shell">
            <PageHeaderSkeleton />
            <Skeleton className="mt-8 h-64 w-full" />
          </div>
        </div>
        <div className="fixed inset-x-0 bottom-0 flex justify-around gap-4 border-t bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-12 w-16" />)}
        </div>
      </div>
    </LoadingRegion>
  );
}
