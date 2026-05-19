"use client"

import { Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { RideList } from "@/components/modules/Ride/RideList"
import { RideCardGridSkeleton } from "@/components/modules/Ride/RideCardSkeleton"
import { Button } from "@/components/ui/button"
import { getSubscriptionStatus } from "@/lib/actions/subscription.actions"
import { getMyRides } from "@/lib/actions/ride.actions"
import { Navigation, MapPin, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function RideListContent() {
  return (
    <Suspense fallback={<RideCardGridSkeleton count={5} />}>
      <RideList />
    </Suspense>
  )
}

interface ActiveRide {
  _id: string
  from: { address: string }
  to: { address: string }
  status: string
}

export function RideListingView() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isDriver = session?.user.subRole === "DRIVER"
  const isRider = session?.user.subRole === "RIDER"
  const [loadingSubscription, setLoadingSubscription] = useState(true)
  const [subscribed, setSubscribed] = useState<boolean | null>(null)
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null)
  const [checkingActiveRide, setCheckingActiveRide] = useState(true)

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

      // Check for active rides
      getMyRides(session.user.accessToken).then((res) => {
        if (res.success && res.data) {
          const active = res.data.find(
            (r: ActiveRide) => r.status === "ACCEPTED" || r.status === "IN_PROGRESS"
          )
          setActiveRide(active || null)
        }
        setCheckingActiveRide(false)
      })
    } else {
      setSubscribed(false)
      setLoadingSubscription(false)
      setCheckingActiveRide(false)
    }
  }, [status, isRider, isDriver, session, router])

  if (loadingSubscription || checkingActiveRide) {
    return <RideCardGridSkeleton count={5} />
  }

  if (!session || isRider) return null

  // Block if driver has an active ride
  if (activeRide) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <Card className="border-2 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mx-auto">
              <Navigation className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                You have an active ride
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your current ride before accepting a new one.
              </p>
            </div>
            <div className="bg-background/50 rounded-lg p-3 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-3.5 h-3.5 text-green-500 shrink-0" />
                <span className="text-muted-foreground truncate">{activeRide.from.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-muted-foreground truncate">{activeRide.to.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <Badge variant={activeRide.status === "ACCEPTED" ? "info" : "warning"}>
                  {activeRide.status === "ACCEPTED" ? "Accepted" : "In Progress"}
                </Badge>
              </div>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => router.push(`/rides/${activeRide._id}`)}
            >
              View Current Ride
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!subscribed) {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center dark:bg-amber-950/70 dark:border-amber-700/40">
          <p className="text-amber-900 dark:text-amber-200 font-semibold mb-3">
            Subscribe to start accepting rides — 700 BDT/month
          </p>
          <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
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
