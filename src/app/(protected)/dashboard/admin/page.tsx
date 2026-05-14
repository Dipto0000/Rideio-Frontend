"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Users,
  Car,
  CreditCard,
  TrendingUp,
  DollarSign,
  CalendarCheck,
  ArrowUpRight,
  Shield,
  Archive,
  RefreshCw,
  Search,
} from "lucide-react"
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
import { getAdminDashboard } from "@/lib/actions/dashboard.actions"

interface AdminData {
  totalUsers: number
  totalDrivers: number
  totalRides: number
  totalRevenue: number
  newSubscriptionsThisMonth: number
  ridesByStatus: Record<string, number>
  topRatedDrivers: {
    _id: string
    name: string
    picture?: string
    averageRating: number
    totalReviews: number
  }[]
  recentRides: {
    _id: string
    from: { address: string }
    to: { address: string }
    status: string
    proposedFare: number
    riderName: string
    driverName: string | null
    createdAt: string
  }[]
}

const statusBadgeVariant: Record<string, string> = {
  PENDING: "warning",
  ACCEPTED: "info",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  CANCELLED: "destructive",
}

export default function AdminDashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!session?.user.accessToken) return
    fetchData()
  }, [session])

  function fetchData() {
    if (!session?.user.accessToken) return
    setLoading(true)
    getAdminDashboard(session.user.accessToken).then((res) => {
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  const totalStatusRides = data?.ridesByStatus
    ? Object.values(data.ridesByStatus).reduce((sum, val) => sum + val, 0)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Platform overview and management at a glance.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="h-auto py-4 justify-start gap-3"
          onClick={() => router.push("/dashboard/admin/users")}
        >
          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm">Manage Users</p>
            <p className="text-xs text-muted-foreground">View, search, and manage users</p>
          </div>
          <ArrowUpRight className="w-4 h-4 ml-auto shrink-0 text-muted-foreground" />
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 justify-start gap-3"
          onClick={() => router.push("/dashboard/admin/rides")}
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm">Manage Rides</p>
            <p className="text-xs text-muted-foreground">View and manage ride requests</p>
          </div>
          <ArrowUpRight className="w-4 h-4 ml-auto shrink-0 text-muted-foreground" />
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 justify-start gap-3"
          onClick={() => router.push("/dashboard/admin/subscriptions")}
        >
          <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm">Subscriptions</p>
            <p className="text-xs text-muted-foreground">Approve and manage payments</p>
          </div>
          <ArrowUpRight className="w-4 h-4 ml-auto shrink-0 text-muted-foreground" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          icon={<Users className="w-5 h-5" />}
          label="Total Users"
          value={data?.totalUsers?.toLocaleString() || "0"}
          accentColor="bg-blue-500"
        />
        <StatsCard
          icon={<Car className="w-5 h-5" />}
          label="Total Drivers"
          value={data?.totalDrivers?.toLocaleString() || "0"}
          accentColor="bg-emerald-500"
        />
        <StatsCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Total Rides"
          value={data?.totalRides?.toLocaleString() || "0"}
          accentColor="bg-purple-500"
        />
        <StatsCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Revenue"
          value={`৳${data?.totalRevenue?.toLocaleString() || "0"}`}
          accentColor="bg-amber-500"
        />
        <StatsCard
          icon={<CalendarCheck className="w-5 h-5" />}
          label="New Subs (Month)"
          value={data?.newSubscriptionsThisMonth?.toLocaleString() || "0"}
          accentColor="bg-rose-500"
        />
        <StatsCard
          icon={<CreditCard className="w-5 h-5" />}
          label="Payment Records"
          value={data?.recentRides?.length || "—"}
          accentColor="bg-cyan-500"
        />
      </div>

      {/* Rides by Status + Top Rated Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rides by Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Rides by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.ridesByStatus && Object.keys(data.ridesByStatus).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(data.ridesByStatus).map(([status, count]) => {
                  const percentage = totalStatusRides > 0 ? Math.round((count / totalStatusRides) * 100) : 0
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{status.toLowerCase().replace(/_/g, " ")}</span>
                        <span className="font-medium text-foreground">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            status === "COMPLETED" ? "bg-emerald-500" :
                            status === "PENDING" ? "bg-amber-500" :
                            status === "ACCEPTED" ? "bg-blue-500" :
                            status === "IN_PROGRESS" ? "bg-purple-500" :
                            "bg-gray-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No ride data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Rated Drivers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Rated Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.topRatedDrivers?.length ? (
              <div className="space-y-3">
                {data.topRatedDrivers.map((driver, idx) => (
                  <div key={driver._id} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-5">#{idx + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground overflow-hidden shrink-0">
                      {driver.picture ? (
                        <img src={driver.picture} alt={driver.name} className="w-full h-full object-cover" />
                      ) : (
                        driver.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">{driver.totalReviews} reviews</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
                      <span>★</span>
                      <span>{driver.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No driver data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Rides */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Rides</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {data?.recentRides?.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Rider</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead className="text-right">Fare</TableHead>
                    <TableHead>Status</TableHead>
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
                        <p className="text-sm text-foreground truncate max-w-[200px]">
                          {ride.from.address} → {ride.to.address}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{ride.riderName}</TableCell>
                      <TableCell className="text-muted-foreground">{ride.driverName || "—"}</TableCell>
                      <TableCell className="text-right font-medium">৳{ride.proposedFare}</TableCell>
                      <TableCell>
                        <Badge variant={(statusBadgeVariant[ride.status] as any) || "outline"}>
                          {ride.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Car className="w-10 h-10 text-muted-foreground" />
              <p className="text-muted-foreground font-medium">No recent rides</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
