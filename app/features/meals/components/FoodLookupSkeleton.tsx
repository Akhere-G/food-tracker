import LoadingRegion from "@/components/ui/LoadingRegion";
import Skeleton from "@/components/ui/skeleton";

export default function FoodLookupSkeleton({ label }: { label: string }) {
  return (
    <LoadingRegion label={label}>
      <div className="space-y-2">
        {[0, 1, 2].map((index) => <Skeleton key={index} className="h-9 w-full" />)}
      </div>
    </LoadingRegion>
  );
}
