import { Suspense } from "react"
import ResetPasswordContent from "./_components/ResetPasswordContent"

export const dynamic = 'force-static'

function ResetPasswordFallback() {
  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="h-11 rounded-xl bg-muted/30 animate-pulse" />
          <div className="h-11 rounded-xl bg-muted/30 animate-pulse" />
          <div className="h-11 rounded-xl bg-muted/30 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
