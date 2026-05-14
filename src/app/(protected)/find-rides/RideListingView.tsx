"use client"

import { Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { RideList } from "@/components/modules/Ride/RideList"
import { RideCardGridSkeleton } from "@/components/modules/Ride/RideCardSkeleton"
import { Button } from "@/components/ui/button"
import { getSubscriptionStatus } from "@/lib/actions/subscription.actions"

function RideListContent() {
  return (
    <Suspense fallback={<RideCardGridSkeleton count={5} />}>
      <RideList />
    </Suspense>
  )
}

export function RideListingView() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isDriver = session?.user.subRole === "DRIVER"
  const isRider = session?.user.subRole === "RIDER"
  const [loadingSubscription, setLoadingSubscription] = useState(true)
  const [subscribed, setSubscribed] = useState<boolean | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (isRider) {
      router.replace("/create-ride")
      return
    }

    if (isDriver && session?.user.accessToken) {
      getSubscriptionStatus(session.user.accessToken).then((res) => {
        setSubscribed(res.data?.isSubscribed ?? false)
        setLoadingSubscription(false)
      })
    } else {
      setSubscribed(false)
      setLoadingSubscription(false)
    }
  }, [status, isRider, isDriver, session, router])

  if (status === "loading" || loadingSubscription) {
    return <RideCardGridSkeleton count={5} />
  }

  if (!session || isRider) return null

  if (!subscribed) {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center dark:bg-amber-950/30 dark:border-amber-900/50">
          <p className="text-amber-800 dark:text-amber-300 font-medium mb-3">
            Subscribe to start accepting rides — 700 BDT/month
          </p>
          <p className="text-amber-700 dark:text-amber-400 text-sm mb-4">
            You can still browse available rides. Subscribe when you&apos;re ready to accept.
          </p>
          <Button variant="primary" onClick={() => router.push("/subscription")}>
            Subscribe Now
          </Button>
        </div>
        <RideListContent />
      </div>
    )
  }

  return <RideListContent />
}
