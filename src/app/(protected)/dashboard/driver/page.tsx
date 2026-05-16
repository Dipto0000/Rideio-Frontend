"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  DollarSign,
  Car,
  Star,
  CreditCard,
  Play,
  CheckCircle,
  MapPin,
  Navigation,
  Clock,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Bell,
} from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsCard } from "@/components/modules/Dashboard/StatsCard"
import { getDriverDashboard } from "@/lib/actions/dashboard.actions"
import { getSubscriptionStatus } from "@/lib/actions/subscription.actions"
import { startRide, completeRide, getRideById } from "@/lib/actions/ride.actions"
import { getNotifications } from "@/lib/actions/notification.actions"
import { RecentNotificationsCard } from "@/components/modules/Notifications/RecentNotificationsCard"
import { RecentReviewsCard } from "@/components/modules/Review/RecentReviewsCard"
import type { RideStatus, AppNotification } from "@/types"

interface RideItem {
  _id: string
  riderName: string
  from: { address: string }
  to: { address: string }
  status: RideStatus
  systemSuggestedFare: number
  createdAt: string
}

interface DriverData {
  totalEarnings: number
  totalRidesCompleted: number
  averageRating: number
  totalReviews: number
  recentRides: RideItem[]
}

const statusBadge: Record<string, string> = {
  PENDING: "warning",
  ACCEPTED: "info",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  CANCELLED: "destructive",
}

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export default function DriverDashboardPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [data, setData] = useState<DriverData | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribed, setSubscribed] = useState(false)
  const [subExpiry, setSubExpiry] = useState<string | null>(null)
  const [subLoading, setSubLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [todayEarnings, setTodayEarnings] = useState<number>(0)
  const [todayRides, setTodayRides] = useState<number>(0)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (authStatus === "loading") return
    if (!session || session.user.subRole !== "DRIVER") {
      router.replace("/dashboard")
      return
    }
    fetchData()
    fetchSubscription()
  }, [session, authStatus, router])

  function fetchData() {
    if (!session?.user.accessToken) return
    setLoading(true)
    getDriverDashboard(session.user.accessToken).then((res) => {
      if (res.success && res.data) {
        setData(res.data)
        // Calculate today's stats from recent rides
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayRidesList = (res.data.recentRides || []).filter((r: RideItem) => {
          const d = new Date(r.createdAt)
          d.setHours(0, 0, 0, 0)
          return d.getTime() === today.getTime() && r.status === "COMPLETED"
        })
        setTodayEarnings(todayRidesList.reduce((sum: number, r: RideItem) => sum + (r.systemSuggestedFare || 0), 0))
        setTodayRides(todayRidesList.length)
      }
      setLoading(false)
    })
  }

  function fetchSubscription() {
    if (!session?.user.accessToken) return
    setSubLoading(true)
    getSubscriptionStatus(session.user.accessToken).then((res) => {
      setSubscribed(res.data?.isSubscribed ?? false)
      setSubExpiry(res.data?.expiryDate || null)
      setSubLoading(false)
    })
  }

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
    fetchSubscription()
    setTimeout(() => setRefreshing(false), 500)
  }, [session])

  async function handleStartRide(rideId: string) {
    if (!session?.user.accessToken) return
    setActionLoading(rideId)
    const res = await startRide(rideId, session.user.accessToken)
    if (res.success) {
      toast.success("Ride started!")
      fetchData()
    } else {
      toast.error(res.message || "Failed to start ride")
    }
    setActionLoading(null)
  }

  async function handleCompleteRide(rideId: string) {
    if (!session?.user.accessToken) return
    setActionLoading(rideId)
    const res = await completeRide(rideId, session.user.accessToken)
    if (res.success) {
      toast.success("Ride completed successfully!")
      fetchData()
    } else {
      toast.error(res.message || "Failed to complete ride")
    }
    setActionLoading(null)
  }

  // Find active rides (ACCEPTED or IN_PROGRESS) the driver is assigned to
  const activeRide = data?.recentRides?.find(
    (r) => r.status === "ACCEPTED" || r.status === "IN_PROGRESS"
  )

  if (authStatus === "loading" || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Driver Dashboard
            <Badge variant="outline" className="ml-2 align-middle text-xs bg-secondary/10 text-secondary border-secondary/20">
              {session?.user?.role === "SUPER_ADMIN"
                ? "Super Admin"
                : session?.user?.role === "ADMIN"
                  ? "Admin"
                  : "Driver"}
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Driver"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Active Ride Card */}
      {activeRide && (
        <Card className="border-2 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    {activeRide.status === "ACCEPTED" ? "Ride Accepted" : "Ride In Progress"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">{activeRide.from.address}</span>
                    <ArrowRight className="w-3 h-3" />
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">{activeRide.to.address}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <Badge variant={activeRide.status === "ACCEPTED" ? "info" : "warning"}>
                  {statusLabel[activeRide.status]}
                </Badge>
                {activeRide.status === "ACCEPTED" && (
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={actionLoading === activeRide._id}
                    onClick={() => handleStartRide(activeRide._id)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    {actionLoading === activeRide._id ? "Starting..." : "Start Ride"}
                  </Button>
                )}
                {activeRide.status === "IN_PROGRESS" && (
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={actionLoading === activeRide._id}
                    onClick={() => handleCompleteRide(activeRide._id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {actionLoading === activeRide._id ? "Completing..." : "Complete Ride"}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => router.push(`/rides/${activeRide._id}`)}>
                  Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Total Earnings"
          value={`৳${data?.totalEarnings?.toLocaleString() || "0"}`}
          accentColor="bg-emerald-500"
        />
        <StatsCard
          icon={<Car className="w-5 h-5" />}
          label="Rides Completed"
          value={data?.totalRidesCompleted || 0}
          accentColor="bg-blue-500"
        />
        <StatsCard
          icon={<Star className="w-5 h-5" />}
          label="Average Rating"
          value={data?.averageRating ? `${data.averageRating.toFixed(1)} (${data.totalReviews})` : "—"}
          accentColor="bg-amber-500"
        />
        <StatsCard
          icon={<CreditCard className="w-5 h-5" />}
          label="Subscription"
          value={subLoading ? "..." : subscribed ? "Active" : "Inactive"}
          accentColor={subscribed ? "bg-emerald-500" : "bg-red-500"}
        />
      </div>

      {/* Today's Earnings + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Earnings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Today&apos;s Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Earnings</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ৳{todayEarnings.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Rides Completed</span>
                <span className="text-lg font-bold text-foreground">{todayRides}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">All-time Rides</span>
                <span className="text-lg font-bold text-foreground">{data?.totalRidesCompleted || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="primary"
                className="h-auto py-4 flex-col items-center gap-1.5"
                onClick={() => router.push("/find-rides")}
              >
                <Car className="w-5 h-5" />
                <span className="text-xs font-normal">Browse Rides</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col items-center gap-1.5"
                onClick={() => router.push("/subscription")}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-normal">
                  {subscribed ? "Subscription" : "Subscribe"}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col items-center gap-1.5"
                onClick={() => router.push("/profile")}
              >
                <Star className="w-5 h-5" />
                <span className="text-xs font-normal">My Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Banner */}
      {!subLoading && !subscribed && (
        <Card className="border-2 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <p className="font-medium text-amber-800 dark:text-amber-300">
                Subscribe to start accepting rides — ৳700/month
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                You can browse available rides anytime. Subscribe when you&apos;re ready to accept.
              </p>
            </div>
            <Button variant="primary" onClick={() => router.push("/subscription")}>
              Subscribe Now
            </Button>
          </CardContent>
        </Card>
      )}

      {!subLoading && subscribed && subExpiry && (
        <Card className="border-2 border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-medium text-emerald-900 dark:text-emerald-200">
                Subscription Active
              </p>
              <p className="text-sm text-emerald-800 dark:text-emerald-300">
                Expires {new Date(subExpiry).toLocaleDateString("en-BD", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Card */}
      <RecentNotificationsCard accessToken={session?.user?.accessToken || ""} />

      {/* Recent Reviews */}
      {session?.user.id && session?.user.accessToken && (
        <RecentReviewsCard driverId={session.user.id} accessToken={session.user.accessToken} />
      )}

      {/* Recent Rides */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Rides</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!data?.recentRides?.length ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center px-4">
              <Car className="w-10 h-10 text-muted-foreground" />
              <p className="text-muted-foreground font-medium">No rides yet</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Browse available rides to get started.
              </p>
              <Button variant="primary" size="sm" onClick={() => router.push("/find-rides")}>
                Find Rides
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Rider</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentRides.map((ride) => (
                    <TableRow
                      key={ride._id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/rides/${ride._id}`)}
                    >
                      <TableCell>
                        <div className="flex flex-col gap-0.5 max-w-[200px]">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 shrink-0 text-green-500" />
                            <span className="truncate">{ride.from.address}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 shrink-0 text-red-500" />
                            <span className="truncate">{ride.to.address}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{ride.riderName}</TableCell>
                      <TableCell className="font-medium">৳{ride.systemSuggestedFare}</TableCell>
                      <TableCell>
                        <Badge variant={(statusBadge[ride.status] as any) || "outline"}>
                          {statusLabel[ride.status] || ride.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {(ride.status === "ACCEPTED" || ride.status === "IN_PROGRESS") && (
                            <>
                              {ride.status === "ACCEPTED" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={actionLoading === ride._id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleStartRide(ride._id)
                                  }}
                                >
                                  <Play className="w-3.5 h-3.5 mr-1" />
                                  Start
                                </Button>
                              )}
                              {ride.status === "IN_PROGRESS" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={actionLoading === ride._id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCompleteRide(ride._id)
                                  }}
                                >
                                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                  Complete
                                </Button>
                              )}
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/rides/${ride._id}`)
                            }}
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
