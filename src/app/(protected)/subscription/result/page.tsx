"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

function SubscriptionResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { update } = useSession()

  const status = searchParams.get("status")

  useEffect(() => {
    if (status === "success") {
      update().catch((err) => console.error("Session update failed:", err))
    }
    router.replace("/find-rides")
  }, [])

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-muted-foreground">
          {status === "success"
            ? "Subscription activated! Redirecting..."
            : "Redirecting..."}
        </p>
      </div>
    </div>
  )
}

function SubscriptionResultFallback() {
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-5 w-64" />
      </div>
    </div>
  )
}

export default function SubscriptionResultPage() {
  return (
    <Suspense fallback={<SubscriptionResultFallback />}>
      <SubscriptionResultContent />
    </Suspense>
  )
}
