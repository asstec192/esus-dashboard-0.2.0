import { HTMLAttributes } from "react"

export function TypographyH3(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={
        "scroll-m-20 text-2xl font-semibold tracking-tight " + props.className
      }
    >
      {props.children}
    </h3>
  )
}
