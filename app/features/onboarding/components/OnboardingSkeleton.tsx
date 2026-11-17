import LoadingRegion from "@/components/ui/LoadingRegion";
import Skeleton from "@/components/ui/skeleton";

export default function OnboardingSkeleton() {
  return (
    <LoadingRegion label="Preparing your plan…" className="mx-auto w-full max-w-5xl">
      <div className="mb-7 grid grid-cols-6 gap-2">
        {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-1.5 w-full" />)}
      </div>
      <Skeleton className="h-5 w-24" />
      <Skeleton className="mt-2 h-20 w-full max-w-3xl md:h-30" />
      <Skeleton className="mt-3 h-6 w-full max-w-2xl" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
      <div className="mt-8 flex justify-end border-t pt-6"><Skeleton className="h-10 w-36" /></div>
    </LoadingRegion>
  );
}
