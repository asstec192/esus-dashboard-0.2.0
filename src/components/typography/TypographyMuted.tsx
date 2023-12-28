import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

export function TypographyMuted({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...rest}>
      {children}
    </p>
  )
}
