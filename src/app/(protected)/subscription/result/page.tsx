"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

function SubscriptionResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { update } = useSession()

  const status = searchParams.get("status")

  useEffect(() => {
    async function handleResult() {
      if (status === "success") {
        try {
          await update()
          toast.success("Subscription activated! You can now accept rides.")
        } catch (err) {
          console.error("Session update failed:", err)
        }
      } else if (status === "cancelled") {
        toast.info("Payment cancelled. You can try again anytime.")
      } else if (status === "failed") {
        toast.error("Payment failed. Please try again.")
      }
      router.replace("/dashboard/driver")
    }
    handleResult()
  }, [])

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
          {status === "success" ? (
            <CheckCircle2 className="w-7 h-7 text-secondary" />
          ) : (
            <Loader2 className="w-7 h-7 animate-spin text-secondary" />
          )}
        </div>
        <p className="text-muted-foreground">
          {status === "success"
            ? "Subscription activated!"
            : status === "cancelled"
              ? "Payment cancelled"
              : status === "failed"
                ? "Payment failed"
                : "Processing..."}
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
