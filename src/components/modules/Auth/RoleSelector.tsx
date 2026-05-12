"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RoleSelector() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Join Rideio</h1>
        <p className="text-muted-foreground mt-2">Choose how you want to use Rideio</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Card
          className="cursor-pointer hover:border-secondary transition-all duration-200 hover:shadow-lg group"
          onClick={() => router.push("/auth/signup?role=rider")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <span className="text-3xl">🚗</span>
              I&apos;m a Rider
            </CardTitle>
            <CardDescription>
              Need a ride? Create a trip post and let drivers come to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">✓ Post your travel route</li>
              <li className="flex items-center gap-2">✓ Choose from available drivers</li>
              <li className="flex items-center gap-2">✓ Safe &amp; tracked rides</li>
            </ul>
            <Button variant="primary" className="w-full mt-4 group-hover:opacity-90">
              Sign up as Rider
            </Button>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-secondary transition-all duration-200 hover:shadow-lg group"
          onClick={() => router.push("/auth/signup?role=driver")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <span className="text-3xl">🏍️</span>
              I&apos;m a Driver
            </CardTitle>
            <CardDescription>
              Earn money by giving rides. Subscribe and start accepting trips.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">✓ Set your own schedule</li>
              <li className="flex items-center gap-2">✓ Earn 700 BDT/month subscription</li>
              <li className="flex items-center gap-2">✓ Build your reputation</li>
            </ul>
            <Button variant="primary" className="w-full mt-4 group-hover:opacity-90">
              Sign up as Driver
            </Button>
          </CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/auth/login" className="text-secondary hover:underline font-medium">
          Log in
        </a>
      </p>
    </div>
  )
}
