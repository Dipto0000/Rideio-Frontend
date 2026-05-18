"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DateTimePicker } from "@/components/ui/DateTimePicker"
import { VehicleTypeSelector } from "@/components/ui/VehicleTypeSelector"
import dynamic from "next/dynamic"

const RideMapPicker = dynamic(() => import("./RideMapPicker").then(mod => ({ default: mod.RideMapPicker })), {
  ssr: false,
  loading: () => <div className="h-96 rounded-xl bg-muted/30 animate-pulse" />,
})
import { createRide } from "@/lib/actions/ride.actions"
import {
  Ruler,
  CheckCircle,
  Clock,
  Navigation,
  MapPin,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

export function CreateRideForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [arrivalTime, setArrivalTime] = useState("")
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car")
  const [success, setSuccess] = useState<{
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
    if (!arrivalTime) {
      setError("Please select arrival date and time")
      return
    }
    if (!session?.user.accessToken) {
      setError("Session not ready. Try refreshing the page.")
      return
    }
    setLoading(true)
    setError("")

    const res = await createRide(
      {
        from: { address: from.address, lat: from.lat, lng: from.lng },
        to: { address: to.address, lat: to.lat, lng: to.lng },
        arrivalTime,
        vehicleType: vehicleType.toUpperCase() as "BIKE" | "CAR",
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
      systemSuggestedFare: ride.systemSuggestedFare,
      distanceInKm: ride.distanceInKm,
    })
    toast.success("Ride posted successfully!")
  }

  if (success) {
    return (
      <div className="space-y-6">
        <Card className="animate-fade-slide-up">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="mx-auto flex h-16 w-16 animate-fade-slide-up items-center justify-center rounded-full bg-secondary/10">
                <CheckCircle className="h-8 w-8 text-secondary" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-foreground">Ride Posted!</h2>
                <p className="text-muted-foreground">
                  Your ride request is now visible to drivers nearby.
                </p>
              </div>

              <div className="mx-auto grid max-w-xs grid-cols-2 gap-4" style={{ animationDelay: "100ms" }}>
                <div className="animate-fade-slide-up space-y-1.5 rounded-xl bg-muted/40 p-4">
                  <Ruler className="mx-auto h-5 w-5 text-muted-foreground" />
                  <p className="text-lg font-bold text-foreground">
                    {success.distanceInKm.toFixed(1)} km
                  </p>
                  <p className="text-xs text-muted-foreground">Distance</p>
                </div>
                <div className="animate-fade-slide-up space-y-1.5 rounded-xl bg-muted/40 p-4" style={{ animationDelay: "150ms" }}>
                  <p className="text-lg font-bold text-foreground">
                    ৳{success.systemSuggestedFare}
                  </p>
                  <p className="text-xs text-muted-foreground">Est. Fare</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Fare is system-calculated based on distance. Riders and drivers
                cannot modify it.
              </p>

              <Button
                variant="primary"
                className="h-11 w-full rounded-xl text-base font-semibold"
                onClick={() => router.push("/dashboard/rider")}
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Section: Route */}
      <section className="space-y-4">

        <RideMapPicker
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
        />
      </section>

      <hr className="border-border" />

      {/* Section: Schedule */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
            <Clock className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Schedule</h2>
            <p className="text-xs text-muted-foreground">
              When do you need to arrive?
            </p>
          </div>
        </div>

        <DateTimePicker value={arrivalTime} onChange={setArrivalTime} />
      </section>

      <hr className="border-border" />

      {/* Section: Vehicle */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
            <MapPin className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Vehicle</h2>
            <p className="text-xs text-muted-foreground">
              Choose your preferred vehicle type
            </p>
          </div>
        </div>

        <VehicleTypeSelector value={vehicleType} onChange={setVehicleType} />
      </section>

      {/* Error */}
      {error && (
        <div className="animate-fade-slide-up rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        className="h-12 w-full rounded-xl text-base font-semibold"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Posting Ride...
          </span>
        ) : (
          "Post Ride"
        )}
      </Button>
    </form>
  )
}
