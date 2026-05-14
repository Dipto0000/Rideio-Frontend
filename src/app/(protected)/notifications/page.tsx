"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "@/lib/actions/notification.actions"
import type { AppNotification, PaginationMeta } from "@/types"

const NOTIFICATION_LABELS: Record<string, string> = {
  RIDE_ACCEPTED: "Ride Accepted",
  RIDE_CANCELLED: "Ride Cancelled",
  RIDE_CANCELLED_BY_DRIVER: "Ride Cancelled by Driver",
  RIDE_STARTED: "Ride Started",
  RIDE_COMPLETED: "Ride Completed",
  NEW_RIDE_AVAILABLE: "New Ride Available",
  SUBSCRIPTION_EXPIRING: "Subscription Expiring",
  SUBSCRIPTION_EXPIRED: "Subscription Expired",
  NEW_USER_REGISTERED: "New User Registered",
  PAYMENT_RECEIVED: "Payment Received",
  RIDE_REPORTED: "Ride Reported",
  ADMIN_CREATED: "Admin Created",
  USER_DELETED: "User Deleted",
  ACCOUNT_BLOCKED: "Account Blocked",
}

const NOTIFICATION_ICONS: Record<string, string> = {
  RIDE_ACCEPTED: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  RIDE_CANCELLED: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  RIDE_CANCELLED_BY_DRIVER: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  RIDE_STARTED: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  RIDE_COMPLETED: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  NEW_RIDE_AVAILABLE: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  SUBSCRIPTION_EXPIRING: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  SUBSCRIPTION_EXPIRED: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  NEW_USER_REGISTERED: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
  PAYMENT_RECEIVED: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
}

function getNotificationIcon(type: string) {
  return NOTIFICATION_ICONS[type] || "bg-muted text-muted-foreground"
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
  }
  if (diffDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}

export default function NotificationsPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const accessToken = session?.user?.accessToken

  const fetchData = useCallback(async (p: number) => {
    if (!accessToken) return
    setLoading(true)
    const res = await getNotifications(accessToken, p, 15)
    if (res.success) {
      setNotifications(res.data || [])
      setMeta(res.meta || null)
    }
    setLoading(false)
  }, [accessToken])

  useEffect(() => {
    if (authStatus === "loading") return
    if (!session) {
      router.replace("/auth/login")
      return
    }
    fetchData(page)
  }, [session, authStatus, page, fetchData, router])

  const handleMarkRead = async (id: string) => {
    if (!accessToken) return
    setActionLoading(id)
    await markAsRead(id, accessToken)
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    )
    setActionLoading(null)
  }

  const handleMarkAllRead = async () => {
    if (!accessToken) return
    setActionLoading("all")
    await markAllAsRead(accessToken)
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setActionLoading(null)
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (authStatus === "loading") {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {meta ? `${meta.total} notification${meta.total !== 1 ? "s" : ""}` : "Loading..."}
            {unreadCount > 0 && (
              <span className="ml-1">
                · <span className="font-medium text-foreground">{unreadCount} unread</span>
              </span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={actionLoading === "all"}
          >
            {actionLoading === "all" ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <CheckCheck className="w-4 h-4 mr-1.5" />
            )}
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      <Card>
        <CardContent className="p-0 divide-y">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Bell className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <p className="font-medium text-muted-foreground">No notifications</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={cn(
                  "flex items-start gap-3 p-4 transition-colors",
                  !n.isRead ? "bg-muted/20" : ""
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    getNotificationIcon(n.type)
                  )}
                >
                  <Bell className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={n.isRead ? "outline" : "default"}
                      className="text-[10px] px-1.5 py-0 h-5"
                    >
                      {NOTIFICATION_LABELS[n.type] || n.type.replace(/_/g, " ")}
                    </Badge>
                    {!n.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm mt-1.5",
                      n.isRead ? "text-muted-foreground" : "font-medium text-foreground"
                    )}
                  >
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1.5">
                    {formatDate(n.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={actionLoading === n._id}
                      onClick={() => handleMarkRead(n._id)}
                    >
                      {actionLoading === n._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCheck className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  )}
                  {n.rideId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => router.push(`/rides/${n.rideId}`)}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            Page {meta.page} of {meta.totalPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPage || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
