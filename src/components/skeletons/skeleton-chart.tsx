import { Skeleton } from "@/components/ui/skeleton"
import { HtmlHTMLAttributes } from "react"

export const SkeletonChart = (props: HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={"flex h-56 w-full flex-col gap-4 p-5 " + props.className}>
      <Skeleton className="h-4 w-32" />
      <div className="flex h-full items-end gap-4">
        <Skeleton className="h-[10%] flex-grow" />
        <Skeleton className="h-[40%] flex-grow" />
        <Skeleton className="h-[25%] flex-grow" />
        <Skeleton className="h-[70%] flex-grow" />
        <Skeleton className="h-[100%] flex-grow" />
        <Skeleton className="h-[20%] flex-grow" />
      </div>
    </div>
  )
}
