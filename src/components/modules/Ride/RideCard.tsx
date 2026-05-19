"use client"

import Link from "next/link"
import { Calendar, Clock, MapPin, Bike, Car, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Ride } from "@/types"

interface RideCardProps {
  ride: Ride
  onAccept?: (rideId: string) => void
  acceptLoading?: boolean
}

export function RideCard({ ride, onAccept, acceptLoading }: RideCardProps) {
  const date = new Date(ride.arrivalTime)
  const formattedDate = date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("en-BD", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-secondary shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {ride.from.address}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">→ {ride.to.address}</p>
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              {ride.riderId?.name || "Anonymous"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formattedTime}
            </span>
            <span className="flex items-center gap-1">
              {ride.vehicleType === "CAR" ? (
                <Car className="w-3.5 h-3.5" />
              ) : (
                <Bike className="w-3.5 h-3.5" />
              )}
              {ride.vehicleType === "CAR" ? "Car" : "Bike"}
            </span>
            <span className="flex items-center gap-1 font-semibold text-primary">
              ৳{ride.systemSuggestedFare}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                ride.status === "PENDING"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                  : ride.status === "ACCEPTED"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                  : "bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300"
              }`}
            >
              {ride.status === "PENDING"
                ? "Available"
                : ride.status === "ACCEPTED"
                ? "Accepted"
                : ride.status}
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/rides/${ride._id}`}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Details
                <ChevronRight className="w-4 h-4" />
              </Link>
              {ride.status === "PENDING" && onAccept && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAccept(ride._id)}
                  disabled={acceptLoading}
                >
                  {acceptLoading ? "Accepting..." : "Accept Ride"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
