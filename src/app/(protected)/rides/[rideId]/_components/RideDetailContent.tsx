"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"

const RideDetailMap = dynamic(() => import("./RideDetailMap").then(mod => ({ default: mod.RideDetailMap })), {
  ssr: false,
  loading: () => <div className="h-64 rounded-xl bg-muted/30 animate-pulse" />,
})
import { ArrowLeft, Calendar, Clock, MapPin, Bike, Car, DollarSign, User, Ruler, ShieldCheck, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getRideById, acceptRide, cancelRide } from "@/lib/actions/ride.actions"
import { getSubscriptionStatus } from "@/lib/actions/subscription.actions"
import { ReviewDialog } from "@/components/modules/Review/ReviewDialog"
import type { Ride } from "@/types"

export default function RideDetailContent() {
  const params = useParams<{ rideId: string }>()
  const rideId = params.rideId
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [ride, setRide] = useState<Ride | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState<boolean | null>(null)

  const isDriver = session?.user.subRole === "DRIVER"
  const isRider = session?.user.subRole === "RIDER"
  const userId = session?.user.id
  const accessToken = session?.user.accessToken
  const isOwnRide = ride?.riderId?._id === userId

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus === "unauthenticated") {
      router.push("/auth/login")
      return
    }
    loadRide()
  }, [authStatus])

  useEffect(() => {
    if (isDriver && accessToken) {
      getSubscriptionStatus(accessToken).then((res) => {
        setSubscribed(res.isSubscribed ?? false)
      })
    } else {
      setSubscribed(false)
    }
  }, [isDriver, accessToken])

  async function loadRide() {
    setLoading(true)
    setError("")
    try {
      const res = await getRideById(params.rideId, accessToken)
      if (res.success) {
        setRide(res.data)
      } else {
        setError(res.message || "Ride not found")
      }
    } catch {
      setError("Failed to load ride details")
    }
    setLoading(false)
  }

  async function handleAccept() {
    if (!accessToken) return
    setActionLoading("accept")
    const res = await acceptRide(params.rideId, accessToken)
    if (res.success) {
      await loadRide()
    } else {
      setError(res.message || "Failed to accept ride")
    }
    setActionLoading(null)
  }

  async function handleCancel() {
    if (!accessToken) return
    setActionLoading("cancel")
    const res = await cancelRide(params.rideId, accessToken)
    if (res.success) {
      await loadRide()
    } else {
      setError(res.message || "Failed to cancel ride")
    }
    setActionLoading(null)
  }

  if (loading || authStatus === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-4 w-28 mb-6" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 md:h-80 w-full rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardContent className="p-5 space-y-4">
                <Skeleton className="h-5 w-16" />
                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="w-0.5 h-12" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-16" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !ride) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Ride Not Found</h2>
        <p className="text-muted-foreground mb-6">{error || "This ride doesn't exist or has been removed."}</p>
        <Button variant="primary" onClick={() => router.push("/find-rides")}>
          Back to Find Rides
        </Button>
      </div>
    )
  }

  const date = new Date(ride.arrivalTime)
  const formattedDate = date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("en-BD", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60",
    ACCEPTED: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60",
    IN_PROGRESS: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60",
    COMPLETED: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800/60",
    CANCELLED: "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900/60 dark:text-gray-300 dark:border-gray-700/60",
  }
  const statusLabels: Record<string, string> = {
    PENDING: "Available",
    ACCEPTED: "Accepted",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/find-rides"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Find Rides
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ride Details</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {ride.from?.address} → {ride.to?.address}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusColors[ride.status] || "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800"}`}
        >
          {statusLabels[ride.status] || ride.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          {ride.from?.lat && ride.to?.lat ? (
            <div className="h-64 md:h-80 rounded-xl overflow-hidden border border-border">
              <RideDetailMap from={ride.from} to={ride.to} />
            </div>
          ) : (
            <div className="h-48 rounded-xl bg-muted flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
              <p className="text-muted-foreground ml-2">Map unavailable</p>
            </div>
          )}

          {/* Quick info cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                <Calendar className="w-5 h-5 text-secondary" />
                <span className="text-xs text-muted-foreground">Date</span>
                <span className="text-sm font-medium">{formattedDate}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                <Clock className="w-5 h-5 text-secondary" />
                <span className="text-xs text-muted-foreground">Time</span>
                <span className="text-sm font-medium">{formattedTime}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                <Ruler className="w-5 h-5 text-secondary" />
                <span className="text-xs text-muted-foreground">Distance</span>
                <span className="text-sm font-medium">
                  {ride.distanceInKm ? `${ride.distanceInKm.toFixed(1)} km` : "—"}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Fare</span>
                <span className="text-sm font-semibold text-primary">৳{ride.systemSuggestedFare}</span>
              </CardContent>
            </Card>
          </div>

          {/* Route */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                Route
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-secondary shrink-0" />
                    <div className="w-0.5 h-12 bg-gradient-to-b from-secondary to-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Pickup</p>
                    <p className="text-sm text-foreground">{ride.from?.address}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Drop-off</p>
                    <p className="text-sm text-foreground">{ride.to?.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Rider info — name visible to everyone, phone visible only to rider or after acceptance */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-secondary" />
                Rider
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {ride.riderId?.picture ? (
                    <img src={ride.riderId.picture} alt={ride.riderId.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{ride.riderId?.name || "Anonymous"}</p>
                  {ride.riderId?.phone && (isOwnRide || ride.status !== "PENDING") && (
                    <p className="text-xs text-muted-foreground">
                      {ride.riderId.phone}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle info */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-foreground">Vehicle</h3>
              <div className="flex items-center gap-2">
                {ride.vehicleType === "CAR" ? (
                  <Car className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Bike className="w-5 h-5 text-muted-foreground" />
                )}
                <span className="text-sm">{ride.vehicleType === "CAR" ? "Car" : "Bike"}</span>
              </div>
              {ride.driverId && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Assigned Driver</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {ride.driverId.picture ? (
                        <img src={ride.driverId.picture} alt="" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{ride.driverId.name}</p>
                      {ride.driverId.phone && (
                        <p className="text-xs text-muted-foreground">{ride.driverId.phone}</p>
                      )}
                    </div>
                  </div>
                  {ride.driverId.numberplate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Vehicle: {ride.driverId.numberplate}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fare details */}
          <Card>
            <CardContent className="p-5 space-y-2">
              <h3 className="font-semibold text-foreground">Fare</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Fare</span>
                <span className="font-semibold text-primary">৳{ride.systemSuggestedFare}</span>
              </div>
              {ride.distanceInKm && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="text-muted-foreground">{ride.distanceInKm.toFixed(1)} km</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            {/* Accept - for drivers on PENDING rides */}
            {ride.status === "PENDING" && isDriver && (
              <>
                {subscribed ? (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleAccept}
                    disabled={actionLoading === "accept"}
                  >
                    {actionLoading === "accept" ? "Accepting..." : "Accept This Ride"}
                  </Button>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center dark:bg-amber-950/70 dark:border-amber-700/40">
                    <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-300 mx-auto mb-2" />
                    <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-2">
                      Subscription Required
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
                      You need an active subscription (700 BDT/month) to accept rides.
                    </p>
                    <Button variant="primary" size="sm" onClick={() => router.push("/subscription")}>
                      Subscribe Now
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Cancel - for ride owner */}
            {(ride.status === "PENDING" || ride.status === "ACCEPTED") && isOwnRide && (
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={handleCancel}
                disabled={actionLoading === "cancel"}
              >
                {actionLoading === "cancel" ? "Cancelling..." : "Cancel Ride"}
              </Button>
            )}

            {/* Review - for rider on completed rides */}
            {ride.status === "COMPLETED" && isRider && accessToken && (
              <ReviewDialog
                rideId={ride._id}
                driverName={ride.driverId?.name}
                accessToken={accessToken}
                onReviewSubmitted={() => loadRide()}
              />
            )}

            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
