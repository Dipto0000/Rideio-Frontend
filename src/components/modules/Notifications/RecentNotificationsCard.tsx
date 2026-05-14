"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, ArrowRight, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getNotifications } from "@/lib/actions/notification.actions"
import type { AppNotification } from "@/types"

const TYPE_LABELS: Record<string, string> = {
  RIDE_ACCEPTED: "Accepted",
  RIDE_CANCELLED: "Cancelled",
  RIDE_CANCELLED_BY_DRIVER: "Cancelled",
  RIDE_STARTED: "Started",
  RIDE_COMPLETED: "Completed",
  SUBSCRIPTION_EXPIRING: "Expiring",
  SUBSCRIPTION_EXPIRED: "Expired",
}

interface RecentNotificationsCardProps {
  accessToken: string
}

export function RecentNotificationsCard({ accessToken }: RecentNotificationsCardProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) return
    getNotifications(accessToken, 1, 5).then((res) => {
      if (res.success && res.data) {
        setNotifications(res.data)
      }
      setLoading(false)
    })
  }, [accessToken])

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!notifications.length) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Recent Notifications
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => router.push("/notifications")}
          >
            <ExternalLink className="w-3 h-3" />
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {notifications.slice(0, 5).map((n) => (
          <button
            key={n._id}
            className={cn(
              "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-muted/50",
              !n.isRead && "bg-muted/20"
            )}
            onClick={() => {
              if (n.rideId) router.push(`/rides/${n.rideId}`)
            }}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                !n.isRead ? "bg-primary" : "bg-transparent"
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {TYPE_LABELS[n.type] && (
                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                    {TYPE_LABELS[n.type]}
                  </Badge>
                )}
                <span
                  className={cn(
                    "text-xs flex-1 truncate",
                    !n.isRead ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {n.message}
                </span>
              </div>
            </div>
            {n.rideId && (
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
