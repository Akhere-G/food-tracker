import Skeleton from "@/components/ui/skeleton";

export default function PageHeaderSkeleton({
  action = false,
  description = false,
}: {
  action?: boolean;
  description?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6 border-b pb-7 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0 flex-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-1 h-10 w-64 max-w-full md:h-15 md:w-80" />
        {description && <Skeleton className="mt-3 h-6 w-full max-w-xl" />}
      </div>
      {action && <Skeleton className="h-10 w-36" />}
    </div>
  );
}
