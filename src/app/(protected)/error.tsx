"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ProtectedError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Protected route error:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/60">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We couldn&apos;t load this page. Please try again.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          className="rounded-xl"
          onClick={reset}
        >
          <RefreshCw className="mr-1.5 h-4 w-4" />
          Try again
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => window.location.href = "/"}
        >
          Go home
        </Button>
      </div>
    </div>
  )
}
