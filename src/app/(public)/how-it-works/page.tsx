"use client"

import { useState } from "react"
import { Car, MapPin, Search, CreditCard, Star, Shield, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const STEPS_RIDER = [
  {
    icon: Search,
    title: "Find a Ride",
    description:
      "Browse available rides heading your way. Use filters to find the perfect match — by route, time, or fare.",
  },
  {
    icon: MapPin,
    title: "Book Your Seat",
    description:
      "Select your preferred ride and confirm your booking. Your driver will receive an instant notification.",
  },
  {
    icon: Car,
    title: "Enjoy the Ride",
    description:
      "Meet your driver at the pickup point and enjoy a comfortable ride to your destination.",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description:
      "After the ride, rate your experience and leave a review to help the community make informed choices.",
  },
]

const STEPS_DRIVER = [
  {
    icon: Search,
    title: "Find Passengers",
    description:
      "Browse ride requests heading your way. Accept the ones that match your route and schedule.",
  },
  {
    icon: MapPin,
    title: "Pick Up",
    description:
      "Head to the pickup location and confirm when you've arrived. Stay connected with your rider via in-app updates.",
  },
  {
    icon: CreditCard,
    title: "Earn & Track",
    description:
      "Get paid for every ride. Track your earnings, ride history, and driver rating from your dashboard.",
  },
  {
    icon: Shield,
    title: "Stay Protected",
    description:
      "We verify every rider and provide insurance coverage. Your safety is our top priority.",
  },
]

const FAQS = [
  {
    q: "Is Rideio available in my city?",
    a: "Rideio is currently operating in Dhaka, Chattogram, and expanding to more cities across Bangladesh. Check back soon for new locations.",
  },
  {
    q: "How are fares calculated?",
    a: "Fares are calculated based on distance, estimated travel time, and current demand. You'll always see the fare before confirming a ride.",
  },
  {
    q: "Can I cancel a ride?",
    a: "Yes, riders can cancel a ride before it starts. If a driver is already on the way, excessive cancellations may result in restrictions.",
  },
  {
    q: "How do I receive payments as a driver?",
    a: "Drivers receive payments directly to their linked mobile banking account (bKash, Nagad, or bank transfer) on a weekly basis.",
  },
]

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"rider" | "driver">("rider")
  const steps = activeTab === "rider" ? STEPS_RIDER : STEPS_DRIVER

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28 px-6 md:px-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight leading-[1.1] mb-4">
            How It Works
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you&apos;re a rider or a driver, Rideio makes the process simple.
          </p>
        </div>
      </section>

      {/* Tabs + Steps */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Tab buttons */}
          <div className="flex items-center justify-center mb-12">
            <div className="inline-flex rounded-xl border border-border/50 bg-card p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("rider")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "rider"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                For Riders
              </button>
              <button
                onClick={() => setActiveTab("driver")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "driver"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                For Drivers
              </button>
            </div>
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/auth/role">
              <Button variant="primary" size="lg">
                {activeTab === "rider" ? "Start Riding Today" : "Start Driving Today"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary tracking-tight text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-border/50 bg-card p-4 [&[open]>summary>.chevron]:rotate-180"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-foreground">
                  {faq.q}
                  <ChevronDown className="chevron w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-4" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of riders and drivers across Bangladesh. Sign up
            today — it&apos;s free.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/role">
              <Button variant="primary" size="lg">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
