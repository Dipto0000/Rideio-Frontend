"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LocationPicker } from "./LocationPicker"
import { createRide } from "@/lib/actions/ride.actions"

export function CreateRideForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [from, setFrom] = useState<{ address: string; lat: number; lng: number } | null>(null)
  const [to, setTo] = useState<{ address: string; lat: number; lng: number } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!from || !to) {
      setError("Please select both pickup and drop-off locations")
      return
    }
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const data = {
      from: { address: from.address, lat: from.lat, lng: from.lng },
      to: { address: to.address, lat: to.lat, lng: to.lng },
      arrivalTime: form.get("arrivalTime") as string,
      vehicleType: (form.get("vehicleType") as "BIKE" | "CAR") || "CAR",
      proposedFare: parseFloat(form.get("proposedFare") as string) || 0,
    }

    if (!data.arrivalTime) {
      setError("Please select arrival time")
      setLoading(false)
      return
    }
    if (data.proposedFare < 1) {
      setError("Please enter a valid fare amount")
      setLoading(false)
      return
    }

    const res = await createRide(data)
    if (!res.success) {
      setError(res.message || "Failed to create ride")
      setLoading(false)
      return
    }
    router.push("/find-rides")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-primary">Pickup Location</label>
        <LocationPicker
          value={from?.address || ""}
          onChange={(loc) => setFrom(loc)}
          placeholder="Enter pickup location..."
          icon={<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />}
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-primary">Drop-off Location</label>
        <LocationPicker
          value={to?.address || ""}
          onChange={(loc) => setTo(loc)}
          placeholder="Enter destination..."
          icon={<Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />}
        />
      </div>

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

      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Proposed Fare (BDT)</label>
        <Input
          name="proposedFare"
          type="number"
          min={1}
          placeholder="e.g. 500"
          className="h-12 bg-muted/30"
          required
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" variant="primary" className="w-full h-12 text-base" disabled={loading}>
        {loading ? "Posting Ride..." : "Post Ride"}
      </Button>
    </form>
  )
}
