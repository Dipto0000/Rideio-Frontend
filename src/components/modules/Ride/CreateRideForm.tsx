"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RideMapPicker } from "./RideMapPicker"
import { createRide } from "@/lib/actions/ride.actions"
import { DollarSign, Ruler, CheckCircle } from "lucide-react"

export function CreateRideForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{
    proposedFare: number
    systemSuggestedFare: number
    distanceInKm: number
  } | null>(null)

  const [from, setFrom] = useState<{ address: string; lat: number; lng: number } | null>(null)
  const [to, setTo] = useState<{ address: string; lat: number; lng: number } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!from || !to) {
      setError("Please select both pickup and drop-off locations")
      return
    }
    if (!session?.user.accessToken) {
      setError("Session not ready. Try refreshing the page.")
      return
    }
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const arrivalTime = form.get("arrivalTime") as string
    if (!arrivalTime) {
      setError("Please select arrival time")
      setLoading(false)
      return
    }

    const res = await createRide(
      {
        from: { address: from.address, lat: from.lat, lng: from.lng },
        to: { address: to.address, lat: to.lat, lng: to.lng },
        arrivalTime,
        vehicleType: (form.get("vehicleType") as "BIKE" | "CAR") || "CAR",
      },
      session.user.accessToken
    )

    if (!res.success) {
      setError(res.message || "Failed to create ride")
      setLoading(false)
      return
    }

    const ride = res.data
    setSuccess({
      proposedFare: ride.proposedFare,
      systemSuggestedFare: ride.systemSuggestedFare,
      distanceInKm: ride.distanceInKm,
    })
  }

  if (success) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-secondary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Ride Posted!</h2>
            <p className="text-muted-foreground mt-1">
              Your ride request is now visible to drivers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="bg-muted/30 rounded-lg p-4 space-y-1">
              <Ruler className="w-5 h-5 text-muted-foreground mx-auto" />
              <p className="text-lg font-bold text-primary">
                {success.distanceInKm.toFixed(1)} km
              </p>
              <p className="text-xs text-muted-foreground">Distance</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 space-y-1">
              <DollarSign className="w-5 h-5 text-muted-foreground mx-auto" />
              <p className="text-lg font-bold text-primary">
                ৳{success.proposedFare}
              </p>
              <p className="text-xs text-muted-foreground">Est. Fare</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Fare is system-calculated based on distance. Riders and drivers cannot modify it.
          </p>
          <Button variant="primary" onClick={() => router.push("/find-rides")}>
            View Available Rides
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <RideMapPicker
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Arrival Time</label>
          <Input
            name="arrivalTime"
            type="datetime-local"
            className="h-12 bg-muted/30"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Vehicle Type</label>
          <select
            name="vehicleType"
            className="flex h-12 w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          >
            <option value="CAR">Car</option>
            <option value="BIKE">Bike</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" variant="primary" className="w-full h-12 text-base" disabled={loading}>
        {loading ? "Posting Ride..." : "Post Ride"}
      </Button>
    </form>
  )
}
