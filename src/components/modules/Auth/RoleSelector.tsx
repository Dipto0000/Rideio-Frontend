"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, User, CheckCircle, ArrowRight, Clock, Shield } from "lucide-react"

const RIDER_FEATURES = [
  "Post your travel route",
  "Choose from available drivers",
  "Safe & tracked rides",
]

const DRIVER_FEATURES = [
  "Set your own schedule",
  "Earn on your terms",
  "Build your reputation",
]

export function RoleSelector() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
          Join Rideio
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Choose how you want to use Rideio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {/* Rider card */}
        <Card
          className="cursor-pointer border-border/40 hover:border-primary/30 transition-all duration-200 hover:shadow-lg group overflow-hidden relative h-full flex flex-col"
          onClick={() => router.push("/auth/signup?role=rider")}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.03] rounded-bl-[100px] pointer-events-none" />
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <User className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
              I&apos;m a Rider
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Need a ride? Create a trip post and let drivers come to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-2.5 mb-5">
              {RIDER_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant="primary"
              className="w-full rounded-xl mt-auto group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-200"
            >
              Sign Up as Rider
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        {/* Driver card */}
        <Card
          className="cursor-pointer border-border/40 hover:border-secondary/30 transition-all duration-200 hover:shadow-lg group overflow-hidden relative h-full flex flex-col"
          onClick={() => router.push("/auth/signup?role=driver")}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/[0.04] rounded-bl-[100px] pointer-events-none" />
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-2">
              <Car className="w-6 h-6 text-secondary" />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
              I&apos;m a Driver
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Earn money by giving rides. Subscribe and start accepting trips.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-2.5 mb-5">
              {DRIVER_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant="primary"
              className="w-full rounded-xl mt-auto group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-200"
            >
              Sign Up as Driver
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <a
          href="/auth/login"
          className="text-secondary hover:underline font-semibold"
        >
          Log in
        </a>
      </p>
    </div>
  )
}
