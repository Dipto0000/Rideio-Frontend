import { Suspense } from "react"
import VerifyContent from "./_components/VerifyContent"

export const dynamic = 'force-static'

function VerifyFallback() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-8 sm:p-10 shadow-sm">
      <div className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-muted/50 animate-pulse" />
        <div className="h-7 w-40 bg-muted/50 animate-pulse rounded-lg" />
        <div className="h-4 w-64 bg-muted/50 animate-pulse rounded-lg" />
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-muted/50 animate-pulse rounded-xl" />
          <div className="h-10 w-32 bg-muted/50 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyContent />
    </Suspense>
  )
}
