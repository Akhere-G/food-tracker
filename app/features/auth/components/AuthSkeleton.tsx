import FormFieldsSkeleton from "@/components/layout/loading/FormFieldsSkeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoadingRegion from "@/components/ui/LoadingRegion";
import Skeleton from "@/components/ui/skeleton";

export default function AuthSkeleton({ registering = false }: { registering?: boolean }) {
  return (
    <LoadingRegion label={registering ? "Loading registration…" : "Loading sign in…"} className="container p-4">
      <Card>
        <CardHeader><Skeleton className="h-10 w-56 max-w-full md:h-15" /></CardHeader>
        <CardContent>
          <FormFieldsSkeleton fields={registering ? 4 : 2} reserveHelp />
          {registering && <Skeleton className="mt-3 h-5 w-3/4" />}
          <Skeleton className="mt-3 h-5 w-60 max-w-full" />
          <Skeleton className="mt-2 h-9 w-full" />
        </CardContent>
      </Card>
    </LoadingRegion>
  );
}
