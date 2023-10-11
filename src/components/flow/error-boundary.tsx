import React, { Component, ErrorInfo, ReactNode } from "react"
import { toast } from "../ui/use-toast"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Erro capturado pelo Error Boundary:", error, errorInfo)
    toast({
      title: "Erro",
      description: error.message,
      variant: "destructive",
    })
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }
  }
}

export default ErrorBoundary
