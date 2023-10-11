import { HTMLAttributes } from "react"

export function TypographyH4(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={
        "scroll-m-20 text-xl font-semibold tracking-tight " + props.className
      }
    >
      {props.children}
    </h4>
  )
}
