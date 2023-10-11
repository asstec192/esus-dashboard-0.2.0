import { HTMLAttributes } from "react"

export function TypographyP(props: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={"leading-7 [&:not(:first-child)]:mt-6 " + props.className}>
      {props.children}
    </p>
  )
}
