"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CreateRideForm } from "@/components/modules/Ride/CreateRideForm"
import { Navigation, Shield, Clock } from "lucide-react"

export default function CreateRidePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isDriver = session?.user.subRole === "DRIVER"

  useEffect(() => {
    if (status === "loading") return
    if (isDriver) {
      router.replace("/find-rides")
    }
  }, [status, isDriver, router])

  if (status === "loading" || !session) {
    return (
      <div className="min-h-[calc(100dvh-3.5rem)] bg-gradient-to-b from-secondary/[0.03] via-background to-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-10 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-muted/30 animate-pulse" />
            <div className="h-8 w-48 mx-auto bg-muted/30 animate-pulse rounded-lg" />
            <div className="h-4 w-64 mx-auto bg-muted/30 animate-pulse rounded-lg" />
          </div>
          <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8 space-y-4">
            <div className="h-11 w-full bg-muted/30 animate-pulse rounded-xl" />
            <div className="h-11 w-full bg-muted/30 animate-pulse rounded-xl" />
            <div className="h-96 w-full bg-muted/30 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isDriver) return null

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-gradient-to-b from-secondary/[0.03] via-background to-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 shadow-sm">
            <Navigation className="h-7 w-7 text-secondary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Create a Ride
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Set your route, pick a time, and we&apos;ll match you with nearby drivers.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-secondary" />
            <span>Fare is system-calculated</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            <span>Drivers respond in minutes</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8 shadow-sm">
          <CreateRideForm />
        </div>
      </div>
    </div>
  )
}
