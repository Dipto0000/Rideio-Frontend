import type { Metadata } from "next"
import RideDetailContent from "./_components/RideDetailContent"

export const metadata: Metadata = {
  title: "Ride Details",
  description: "View ride details, route, fare, and driver information on Rideio.",
}

export default function RideDetailPage() {
  return <RideDetailContent />
}
