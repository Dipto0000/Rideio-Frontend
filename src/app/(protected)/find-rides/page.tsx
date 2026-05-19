import type { Metadata } from "next"
import { RideListingView } from "./RideListingView"

export const metadata: Metadata = {
  title: "Find Rides",
  description: "Browse available rides heading your way. Find the perfect ride on Rideio.",
}

export default function FindRidesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Find Rides</h1>
        <p className="text-muted-foreground mt-1">
          Browse available ride requests and accept the ones that suit you best.
        </p>
      </div>
      <RideListingView />
    </div>
  )
}
