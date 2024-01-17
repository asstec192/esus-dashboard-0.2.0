import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function TypographySmall({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <small className={cn("text-sm font-medium", className)} {...props}>
      {children}
    </small>
  );
}
