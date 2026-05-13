"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function SubscriptionResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { update } = useSession()

  const status = searchParams.get("status")

  useEffect(() => {
    if (status === "success") {
      update().catch(() => {})
    }
    router.replace("/find-rides")
  }, []) // only on mount

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
