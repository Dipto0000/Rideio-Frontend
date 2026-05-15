import { Suspense } from "react"
import AuthErrorContent from "./_components/AuthErrorContent"

export const dynamic = 'force-static'

function AuthErrorFallback() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-8 sm:p-10 shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted/50 animate-pulse" />
        <div className="h-6 w-48 bg-muted/50 animate-pulse rounded-lg" />
        <div className="h-4 w-64 bg-muted/50 animate-pulse rounded-lg" />
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-muted/50 animate-pulse rounded-xl" />
          <div className="h-10 w-28 bg-muted/50 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<AuthErrorFallback />}>
      <AuthErrorContent />
    </Suspense>
  )
}
