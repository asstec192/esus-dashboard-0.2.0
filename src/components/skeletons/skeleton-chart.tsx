import type { HtmlHTMLAttributes } from "react";

import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonChart = (props: HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={
        "flex h-full min-h-[300px] w-full items-end gap-4 p-5" + props.className
      }
    >
      <Skeleton className="h-20 w-5 flex-grow" />
      <Skeleton className="h-10 w-5 flex-grow" />
      <Skeleton className="h-40 w-5 flex-grow" />
      <Skeleton className="h-56 w-5 flex-grow" />
      <Skeleton className="h-64 w-5 flex-grow" />
      <Skeleton className="h-10 w-5 flex-grow" />
    </div>
  );
};
