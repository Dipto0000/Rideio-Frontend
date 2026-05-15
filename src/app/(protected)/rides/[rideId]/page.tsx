import type { Metadata } from "next"
import RideDetailContent from "./_components/RideDetailContent"

export const metadata: Metadata = {
  title: "Ride Details - Rideio",
}

export const revalidate = 30

export default function RideDetailPage() {
  return <RideDetailContent />
}
