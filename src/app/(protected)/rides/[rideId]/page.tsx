import type { Metadata } from "next"
import RideDetailContent from "./_components/RideDetailContent"

export const metadata: Metadata = {
  title: "Ride Details - Rideio",
}

export default function RideDetailPage() {
  return <RideDetailContent />
}
