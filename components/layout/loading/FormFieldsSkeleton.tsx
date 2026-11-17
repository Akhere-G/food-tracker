import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function FormFieldsSkeleton({
  fields = 2,
  reserveHelp = false,
}: {
  fields?: number;
  reserveHelp?: boolean;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: fields }, (_, index) => (
        <div key={index} className={cn("space-y-2", reserveHelp && "pb-5")}>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}
