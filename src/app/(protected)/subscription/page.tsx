"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function SubscriptionPage() {
  const router = useRouter()

  return (
    <div className="max-w-lg mx-auto p-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Driver Subscription</CardTitle>
          <CardDescription>
            Subscribe to start accepting ride requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">৳700</p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
          <ul className="space-y-3">
            {[
              "Accept unlimited ride requests",
              "Access to rider contact info",
              "Ride history & earnings dashboard",
              "24/7 support",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <Button variant="primary" className="w-full" disabled>
            Subscribe (Coming Soon)
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Payment integration with SSLCommerz coming soon.
          </p>
          <div className="text-center">
            <button
              onClick={() => router.push("/find-rides")}
              className="text-sm text-secondary hover:underline"
            >
              Back to Find Rides
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
