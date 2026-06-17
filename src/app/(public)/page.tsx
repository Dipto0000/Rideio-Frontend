import type { Metadata } from "next"
import { Hero } from "@/components/home/Hero"
import { ImpactCounter } from "@/components/home/ImpactCounter"
import { HowItWorksTabs } from "@/components/home/HowItWorksTabs"
import { ActivityFeed } from "@/components/home/ActivityFeed"
import { CoverageCities } from "@/components/home/CoverageCities"
import { Testimonials } from "@/components/home/Testimonials"
import { SafetyTrust } from "@/components/home/SafetyTrust"
import { DriverEarnings } from "@/components/home/DriverEarnings"
import { CTABanner } from "@/components/home/CTABanner"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Home",
  description:
    "Find affordable rides or earn as a driver across Bangladesh. Community-driven, safe, and transparent ride sharing.",
  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: "Rideio",
    url: "https://rideio.vercel.app/",
    title: "Rideio — Community Ride Sharing in Bangladesh",
    description: "Find affordable rides or earn as a driver. Safe, verified, and transparent.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rideio — Community Ride Sharing" }],
  },
}

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <ImpactCounter />
      <section className="py-20 md:py-28 px-6 md:px-12 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
              How It Works
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              Whether you&apos;re riding or driving — getting started is simple.
            </p>
          </div>
          <HowItWorksTabs />
        </div>
      </section>
      <ActivityFeed />
      <CoverageCities />
      <Testimonials />
      <SafetyTrust />
      <DriverEarnings />
      <CTABanner />
    </div>
  )
}
