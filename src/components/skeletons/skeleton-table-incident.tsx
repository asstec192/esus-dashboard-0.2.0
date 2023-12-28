import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TableIncidentsLoading() {
  return (
    <Card className="flex h-[calc(100vh-1rem-var(--nav))] flex-col gap-4 rounded-lg p-6">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-[250px]" />
        <Skeleton className="h-6 w-[250px]" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-full w-full" />
    </Card>
  );
}
