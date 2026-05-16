"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Car,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  MapPin,
  User,
  Navigation,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Crosshair,
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
import { getRiderDashboard } from "@/lib/actions/dashboard.actions"
import { cancelRide } from "@/lib/actions/ride.actions"
import { ReviewDialog } from "@/components/modules/Review/ReviewDialog"
import { RecentNotificationsCard } from "@/components/modules/Notifications/RecentNotificationsCard"
import type { RideStatus } from "@/types"

interface RideItem {
  _id: string
  from: { address: string }
  to: { address: string }
  status: RideStatus
  systemSuggestedFare: number
  vehicleType?: string
  driverName?: string
  driverRating?: number
  createdAt: string
}

interface RiderData {
  totalRidesPosted: number
  activeRides: number
  completedRides: number
  cancelledRides: number
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

export default function RiderDashboardPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [data, setData] = useState<RiderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (authStatus === "loading") return
    if (!session || session.user.subRole !== "RIDER") {
      router.replace("/dashboard")
      return
    }
    fetchData()
  }, [session, authStatus, router])

  function fetchData() {
    if (!session?.user.accessToken) return
    setLoading(true)
    getRiderDashboard(session.user.accessToken).then((res) => {
      if (res.success && res.data) {
        setData(res.data)
      }
      setLoading(false)
    })
  }

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
    setTimeout(() => setRefreshing(false), 500)
  }, [session])

  async function handleCancelRide(rideId: string) {
    if (!session?.user.accessToken) return
    setActionLoading(rideId)
    const res = await cancelRide(rideId, session.user.accessToken)
    if (res.success) {
      toast.success("Ride cancelled successfully")
      fetchData()
    } else {
      toast.error(res.message || "Failed to cancel ride")
    }
    setActionLoading(null)
  }

  // Find in-progress ride for tracking card
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
            Rider Dashboard
            <Badge variant="outline" className="ml-2 align-middle text-xs bg-secondary/10 text-secondary border-secondary/20">
              {session?.user?.role === "SUPER_ADMIN"
                ? "Super Admin"
                : session?.user?.role === "ADMIN"
                  ? "Admin"
                  : "Rider"}
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Rider"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => router.push("/create-ride")}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create Ride
          </Button>
        </div>
      </div>

      {/* Active Ride Tracking Card */}
      {activeRide && (
        <Card className="border-2 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center animate-pulse">
                  <Crosshair className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-lg">
                    {activeRide.status === "ACCEPTED"
                      ? "Driver on the way"
                      : "Ride In Progress"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-green-500" />
                    <span className="truncate">{activeRide.from.address}</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-red-500" />
                    <span className="truncate">{activeRide.to.address}</span>
                  </div>
                  {activeRide.driverName && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{activeRide.driverName}</span>
                      {activeRide.vehicleType && (
                        <Badge variant="outline" className="text-xs">
                          {activeRide.vehicleType}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={activeRide.status === "ACCEPTED" ? "info" : "warning"}>
                  {statusLabel[activeRide.status]}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => router.push(`/rides/${activeRide._id}`)}>
                  <Navigation className="w-4 h-4 mr-1" />
                  Track
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Car className="w-5 h-5" />}
          label="Total Posted"
          value={data?.totalRidesPosted || 0}
          accentColor="bg-blue-500"
        />
        <StatsCard
          icon={<Clock className="w-5 h-5" />}
          label="Active Rides"
          value={data?.activeRides || 0}
          accentColor="bg-amber-500"
        />
        <StatsCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Completed"
          value={data?.completedRides || 0}
          accentColor="bg-emerald-500"
        />
        <StatsCard
          icon={<XCircle className="w-5 h-5" />}
          label="Cancelled"
          value={data?.cancelledRides || 0}
          accentColor="bg-red-500"
        />
      </div>

      {/* Notification Card */}
      <RecentNotificationsCard accessToken={session?.user?.accessToken || ""} />

      {/* Create Ride Quick Card */}
      <Card>
        <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
            <Car className="w-6 h-6 text-secondary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-medium text-foreground">Need a ride?</p>
            <p className="text-sm text-muted-foreground">
              Create a new ride post and drivers will come to you.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => router.push("/create-ride")}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create Ride
          </Button>
        </CardContent>
      </Card>

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
                Create a ride post and drivers will start accepting your rides.
              </p>
              <Button variant="primary" size="sm" onClick={() => router.push("/create-ride")}>
                <Plus className="w-4 h-4 mr-1.5" />
                Create Your First Ride
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Driver</TableHead>
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
                      <TableCell>
                        {ride.driverName ? (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{ride.driverName}</span>
                            {ride.vehicleType && (
                              <Badge variant="outline" className="text-xs ml-1">
                                {ride.vehicleType}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">৳{ride.systemSuggestedFare}</TableCell>
                      <TableCell>
                        <Badge variant={(statusBadge[ride.status] as any) || "outline"}>
                          {statusLabel[ride.status] || ride.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {(ride.status === "PENDING" || ride.status === "ACCEPTED") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoading === ride._id}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCancelRide(ride._id)
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              {actionLoading === ride._id ? "..." : "Cancel"}
                            </Button>
                          )}
                          {ride.status === "COMPLETED" && session?.user.accessToken && (
                            <ReviewDialog
                              rideId={ride._id}
                              driverName={ride.driverName}
                              accessToken={session.user.accessToken}
                            />
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
