import type { Metadata } from "next"
import { Hero } from "@/components/home/Hero"
import { ActivityFeed } from "@/components/home/ActivityFeed"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Home",
  description:
    "Find affordable rides or earn as a driver across Bangladesh. Community-driven, safe, and transparent ride sharing.",
  openGraph: {
    title: "Rideio — Community Ride Sharing in Bangladesh",
    description: "Find affordable rides or earn as a driver. Safe, verified, and transparent.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rideio — Community Ride Sharing" }],
  },
}

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <ActivityFeed />
    </div>
  )
}
