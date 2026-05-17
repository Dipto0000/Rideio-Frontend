"use client"

import { useState } from "react"
import { Car, MapPin, Search, CreditCard, Star, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const STEPS_RIDER = [
  { icon: Search, title: "Find a Ride", description: "Browse available rides heading your way. Use filters to find the perfect match — by route, time, or fare." },
  { icon: MapPin, title: "Book Your Seat", description: "Select your preferred ride and confirm your booking. Your driver will receive an instant notification." },
  { icon: Car, title: "Enjoy the Ride", description: "Meet your driver at the pickup point and enjoy a comfortable ride to your destination." },
  { icon: Star, title: "Rate & Review", description: "After the ride, rate your experience and leave a review to help the community make informed choices." },
]

const STEPS_DRIVER = [
  { icon: Search, title: "Find Passengers", description: "Browse ride requests heading your way. Accept the ones that match your route and schedule." },
  { icon: MapPin, title: "Pick Up", description: "Head to the pickup location and confirm when you've arrived. Stay connected with your rider via in-app updates." },
  { icon: CreditCard, title: "Earn & Track", description: "Get paid for every ride. Track your earnings, ride history, and driver rating from your dashboard." },
  { icon: Shield, title: "Stay Protected", description: "We verify every rider and provide insurance coverage. Your safety is our top priority." },
]

export function HowItWorksTabs() {
  const [activeTab, setActiveTab] = useState<"rider" | "driver">("rider")
  const steps = activeTab === "rider" ? STEPS_RIDER : STEPS_DRIVER

  return (
    <>
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
    </>
  )
}
