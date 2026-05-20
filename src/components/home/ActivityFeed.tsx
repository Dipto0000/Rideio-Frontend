"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import {
  Activity,
  ArrowRight,
  Bike,
  Car,
  Clock,
  MapPin,
  TrendingUp,
  Users,
  Banknote,
} from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Types

interface ActivityEvent {
  id: string
  name: string
  from: string
  to: string
  fare: number
  vehicleType: "BIKE" | "CAR"
  timestamp: Date
}

// Placeholder data for empty states

function generateMockRides(): ActivityEvent[] {
  const now = Date.now()
  return [
    { id: "m1", name: "Rahim U.", from: "Gulshan 1", to: "Motijheel", fare: 120, vehicleType: "CAR", timestamp: new Date(now - 2 * 60_000) },
    { id: "m2", name: "Sadia K.", from: "Banani", to: "Dhanmondi", fare: 85, vehicleType: "BIKE", timestamp: new Date(now - 5 * 60_000) },
    { id: "m3", name: "Tariq M.", from: "Uttara Sector 4", to: "Mohakhali", fare: 150, vehicleType: "CAR", timestamp: new Date(now - 8 * 60_000) },
    { id: "m4", name: "Nusrat J.", from: "Mirpur 10", to: "Farmgate", fare: 60, vehicleType: "BIKE", timestamp: new Date(now - 13 * 60_000) },
    { id: "m5", name: "Hasan A.", from: "Bashundhara R/A", to: "Kawran Bazar", fare: 110, vehicleType: "CAR", timestamp: new Date(now - 19 * 60_000) },
    { id: "m6", name: "Farzana L.", from: "Mohammadpur", to: "Motijheel", fare: 95, vehicleType: "BIKE", timestamp: new Date(now - 27 * 60_000) },
    { id: "m7", name: "Shamim R.", from: "Malibagh", to: "Gulshan 2", fare: 80, vehicleType: "CAR", timestamp: new Date(now - 34 * 60_000) },
    { id: "m8", name: "Jannat F.", from: "Banani DOHS", to: "Kakrail", fare: 70, vehicleType: "BIKE", timestamp: new Date(now - 42 * 60_000) },
  ]
}

// Helpers

function getRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "Just now"
  if (mins === 1) return "1 min ago"
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours === 1) return "1 hour ago"
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? "Yesterday" : `${days} days ago`
}

// Sub-components

function StatCard({
  target,
  label,
  icon: Icon,
}: {
  target: number
  label: string
  icon: React.ElementType
}) {
  return (
    <div className="relative overflow-hidden flex flex-col items-center gap-2 p-4 md:p-5 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-md transition-all group isolate">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-2.5 rounded-full bg-secondary/10 text-secondary group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex flex-col items-center">
        <span className="text-2xl md:text-3xl font-extrabold text-foreground tabular-nums tracking-tight flex items-center">
          {target.toLocaleString()}
          <span className="text-lg md:text-xl text-secondary ml-0.5">+</span>
        </span>
        <span className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wider text-center mt-0.5">
          {label}
        </span>
      </div>
    </div>
  )
}

function ActivityCard({ event }: { event: ActivityEvent }) {
  const [time, setTime] = useState(getRelativeTime(event.timestamp))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getRelativeTime(event.timestamp))
    }, 30_000)
    return () => clearInterval(interval)
  }, [event.timestamp])

  return (
    <Link href={`/rides/${event.id}`} className="block h-full">
      <Card className="p-4 border border-border/40 bg-card hover:bg-card/80 hover:border-border/60 hover:shadow-md transition-all duration-200 group h-full">
        <div className="flex items-start gap-3">
          <Avatar className="w-9 h-9 ring-2 ring-secondary/10 shrink-0">
            <AvatarFallback className="bg-secondary/10 text-secondary font-bold text-xs">
              {event.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Name + time */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-foreground truncate">{event.name}</span>
              <span className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1 whitespace-nowrap">
                <Clock className="w-3 h-3" />
                {time}
              </span>
            </div>

            {/* Route */}
            <div className="mt-1.5 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed truncate max-w-[200px]">
                <span className="font-medium text-foreground">{event.from}</span>
                <span className="mx-1.5 text-muted-foreground/50">→</span>
                <span className="font-medium text-foreground">{event.to}</span>
              </p>
            </div>

            {/* Meta */}
            <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                {event.vehicleType === "CAR" ? (
                  <Car className="w-3 h-3" />
                ) : (
                  <Bike className="w-3 h-3" />
                )}
                {event.vehicleType === "CAR" ? "Car" : "Bike"}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                ৳{event.fare}
              </span>
              <span className="inline-flex items-center gap-1 ml-auto text-primary/0 group-hover:text-primary transition-all duration-200">
                Details <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

function ActivitySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4 border border-border/40">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-muted shrink-0 animate-pulse" />
            <div className="flex-1 space-y-2.5">
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-muted rounded w-16 animate-pulse" />
              </div>
              <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
              <div className="flex gap-3">
                <div className="h-3 bg-muted rounded w-12 animate-pulse" />
                <div className="h-3 bg-muted rounded w-14 animate-pulse" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// Main Component

export function ActivityFeed() {
  const { data: session } = useSession()
  const subRole = session?.user.subRole
  const ctaHref = subRole === "DRIVER" ? "/find-rides" : subRole === "RIDER" ? "/create-ride" : "/auth/role"
  const ctaLabel = subRole === "DRIVER" ? "Find rides" : subRole === "RIDER" ? "Create a ride" : "Get started"

  const [realData, setRealData] = useState<ActivityEvent[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [mockIndex, setMockIndex] = useState(0)
  const [statusText, setStatusText] = useState("")
  const mockRides = useRef(generateMockRides())

  // Fetch real ride data from API
  const fetchRealData = useCallback(async () => {
    try {
      const res = await fetch("/api/backend/rides?limit=6&status=PENDING")
      const json = await res.json()

      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const events: ActivityEvent[] = json.data.map((ride: Record<string, unknown>) => ({
          id: String(ride._id ?? crypto.randomUUID()),
          name: (ride.riderId as Record<string, unknown>)?.name as string ?? "Anonymous",
          from: ((ride.from as Record<string, unknown>)?.address as string) ?? "Unknown",
          to: ((ride.to as Record<string, unknown>)?.address as string) ?? "Unknown",
          fare: (ride.systemSuggestedFare as number) ?? 0,
          vehicleType: ((ride.vehicleType as string) ?? "BIKE") as "BIKE" | "CAR",
          timestamp: new Date((ride.createdAt as string) ?? Date.now()),
        }))
        setRealData(events)
        setStatusText(`${events.length} active rides right now`)
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      const hasData = await fetchRealData()
      if (!cancelled) {
        if (!hasData) {
          setStatusText("Simulated activity — real data will appear when rides are live")
        }
        setLoading(false)
      }
    }

    init()

    // Poll for new data every 30s
    const poller = setInterval(async () => {
      const hasData = await fetchRealData()
      if (hasData && !cancelled) {
        setLoading(false)
      }
    }, 30_000)

    return () => {
      cancelled = true
      clearInterval(poller)
    }
  }, [fetchRealData])

  // Cycle through mock data for placeholder
  useEffect(() => {
    if (realData || loading) return
    const interval = setInterval(() => {
      setMockIndex((prev) => (prev + 3) % mockRides.current.length)
    }, 4_000)
    return () => clearInterval(interval)
  }, [realData, loading])

  const showMock = !realData && !loading

  // Get the 3 cards to display
  const displayedEvents = realData
    ? realData.slice(0, 3)
    : showMock
      ? [
          mockRides.current[mockIndex % mockRides.current.length],
          mockRides.current[(mockIndex + 1) % mockRides.current.length],
          mockRides.current[(mockIndex + 2) % mockRides.current.length],
        ]
      : []

  return (
    <section className="relative py-20 md:py-28 px-6 md:px-12 bg-background isolate">
      {/* Subtle decorative background replacing the buggy gradient */}
      <div className="absolute inset-0 bg-muted/10 pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 w-fit">
              <Activity className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                {showMock ? "Live Feed" : "Live Activity"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
              {showMock ? "Rides in Your City" : "Today's Rides"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md">
              {showMock
                ? "Real-time ride activity happening near you. Join the movement!"
                : "Powered by the Rideio community"}
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors shrink-0"
          >
            {ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-10 max-w-md mx-auto">
          <StatCard target={realData?.length || displayedEvents.length} label="Active Rides" icon={TrendingUp} />
          <StatCard target={new Set(displayedEvents.map(e => e.name)).size} label="Riders Nearby" icon={Users} />
        </div>

        {/* Activity cards */}
        {loading ? (
          <ActivitySkeleton />
        ) : (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              key={showMock ? mockIndex : "real"}
            >
              {displayedEvents.map((event, i) => (
                <div
                  key={event.id}
                  className="animate-fade-slide-up h-full"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <ActivityCard event={event} />
                </div>
              ))}
            </div>

            {/* Footer status */}
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                {showMock ? (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>{statusText || "Simulated activity"}</span>
                  </>
                ) : (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>{statusText}</span>
                  </>
                )}
              </div>

              {showMock && (
                <p className="text-[11px] text-muted-foreground/60 max-w-sm text-center leading-relaxed">
                  🚀 Rides are auto-refreshing every 30s. When someone books a ride,
                  it'll appear here instantly.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
