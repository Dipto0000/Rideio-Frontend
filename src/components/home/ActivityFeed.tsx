"use client"

import { MapPin, Car, Shield, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleClick = () => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/login?callbackUrl=/find-rides")
      return
    }
    router.push("/find-rides")
  }

  return (
    <Card
      className="p-6 border border-border/40 bg-card hover:bg-card/80 hover:border-border/60 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick()
      }}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  )
}

const FEATURES = [
  {
    icon: MapPin,
    title: "Find Rides Near You",
    description: "Browse available rides heading your way across Dhaka, Chattogram, and more cities.",
  },
  {
    icon: Car,
    title: "Verified Drivers",
    description: "Every driver is verified. Travel with confidence knowing who's behind the wheel.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Verified riders and drivers, community ratings, and in-app support for every trip.",
  },
  {
    icon: Clock,
    title: "Ride on Your Schedule",
    description: "Book instantly or schedule ahead. No surge pricing — just fair, transparent fares.",
  },
]

export function ActivityFeed() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
            Why Choose Rideio?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Bangladesh&apos;s most trusted community-driven ride-sharing platform.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* Footer text */}
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Click any card to explore available rides.
        </p>
      </div>
    </section>
  )
}
