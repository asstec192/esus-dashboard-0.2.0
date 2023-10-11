import type { ReactNode } from "react"

type ShowProps = {
  when: boolean
  children: ReactNode
  fallback: ReactNode
}

export function Show({ when, children, fallback }: ShowProps) {
  if (when) {
    return fallback
  }
  return children
}
