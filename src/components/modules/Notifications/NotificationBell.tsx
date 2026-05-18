"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Bell, CheckCheck, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getUnreadCount as fetchUnreadCountAction, getNotifications, markAllAsRead } from "@/lib/actions/notification.actions"
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

export function NotificationBell() {
  const { data: session } = useSession()
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [markingAll, setMarkingAll] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const accessToken = session?.user?.accessToken

  const fetchUnreadCount = useCallback(async () => {
    if (!accessToken) return
    const res = await fetchUnreadCountAction(accessToken)
    if (res.success && res.data?.count !== undefined) {
      setUnreadCount(res.data.count)
    }
  }, [accessToken])

  const fetchRecentNotifications = useCallback(async () => {
    if (!accessToken) return
    const res = await getNotifications(accessToken, 1, 5)
    if (res.success && res.data) {
      setNotifications(res.data)
    }
  }, [accessToken])

  // Poll every 30s
  useEffect(() => {
    if (!accessToken) return
    fetchUnreadCount()
    fetchRecentNotifications()
    pollRef.current = setInterval(() => {
      fetchUnreadCount()
      fetchRecentNotifications()
    }, 30000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [accessToken, fetchUnreadCount, fetchRecentNotifications])

  // Refetch on tab focus
  useEffect(() => {
    const handleFocus = () => {
      fetchUnreadCount()
      fetchRecentNotifications()
    }
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [fetchUnreadCount, fetchRecentNotifications])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleToggle = async () => {
    if (!isOpen) {
      setLoading(true)
      await fetchRecentNotifications()
      setLoading(false)
    }
    setIsOpen(!isOpen)
  }

  const handleMarkAllRead = async () => {
    if (!accessToken) return
    setMarkingAll(true)
    const res = await markAllAsRead(accessToken)
    if (res.success) {
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    }
    setMarkingAll(false)
  }

  const handleViewAll = () => {
    setIsOpen(false)
    router.push("/notifications")
  }

  const timeAgo = (dateStr: string) => {
    const now = Date.now()
    const date = new Date(dateStr).getTime()
    const diffMs = now - date
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={handleToggle}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border bg-card shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={handleMarkAllRead}
                disabled={markingAll}
              >
                {markingAll ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCheck className="w-3 h-3" />
                )}
                Mark all read
              </Button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center px-4">
                <Bell className="w-8 h-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b last:border-b-0 transition-colors hover:bg-muted/50",
                    !n.isRead && "bg-muted/20"
                  )}
                  onClick={() => {
                    setIsOpen(false)
                    if (n.rideId) {
                      router.push(`/rides/${n.rideId}`)
                    }
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    {!n.isRead && (
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                    <div className={cn("flex-1 min-w-0", n.isRead && "ml-[18px]")}>
                      <p className="text-xs font-medium text-muted-foreground">
                        {NOTIFICATION_LABELS[n.type] || n.type.replace(/_/g, " ")}
                      </p>
                      <p className={cn(
                        "text-sm mt-0.5 leading-snug",
                        !n.isRead ? "font-medium text-foreground" : "text-muted-foreground"
                      )}>
                        {n.message}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-2.5">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs gap-1"
              onClick={handleViewAll}
            >
              <ExternalLink className="w-3 h-3" />
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
