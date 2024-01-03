import { HTMLAttributes } from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

export const SkeletonTable = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <Card
      className={cn("flex flex-col justify-stretch divide-y-2", className)}
      {...props}
    >
      {Array.from(Array(8)).map((_, index) => (
        <div
          key={index}
          className="flex h-full flex-grow items-center gap-4 p-2"
        >
          <Skeleton className="h-4 flex-grow" />
          <Skeleton className="h-4 flex-grow" />
          <Skeleton className="h-4 flex-grow" />
          <Skeleton className="h-4 flex-grow" />
        </div>
      ))}
    </Card>
  );
};
