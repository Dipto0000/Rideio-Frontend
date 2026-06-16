"use client"

import { MapPin, ArrowRight, Navigation, Car } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export function BookingCard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleFindRide = () => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/login?callbackUrl=/create-ride")
      return
    }
    router.push("/create-ride")
  }

  const handleAcceptRide = () => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/login?callbackUrl=/find-rides")
      return
    }
    router.push("/find-rides")
  }

  return (
    <Card className="w-full max-w-md border border-border/40 bg-card">
      <CardContent className="p-6 sm:p-8">
        <Tabs defaultValue="ride" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/40 rounded-xl p-1">
            <TabsTrigger
              value="ride"
              className="px-4 py-2.5 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground rounded-lg"
            >
              <Navigation className="w-4 h-4 mr-2 inline-block" />
              I need a Ride
            </TabsTrigger>
            <TabsTrigger
              value="drive"
              className="px-4 py-2.5 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground rounded-lg"
            >
              <Car className="w-4 h-4 mr-2 inline-block" />
              I want to Drive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ride" className="space-y-5">
            <div
              className="relative group cursor-pointer"
              onClick={handleFindRide}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleFindRide() }}
            >
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary w-5 h-5 transition-colors group-focus-within:text-secondary pointer-events-none" />
              <Input
                placeholder="Where are you going?"
                className="pl-11 h-12 bg-muted/20 border-border/50 focus:border-secondary/50 placeholder:text-muted-foreground/50 text-base font-medium rounded-xl cursor-pointer"
                readOnly
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium px-1">
                Popular routes
              </p>
              <div className="flex flex-wrap gap-2">
                {["Gulshan → Motijheel", "Banani → Dhanmondi", "Uttara → Mohakhali"].map(
                  (route) => (
                    <button
                      key={route}
                      onClick={handleFindRide}
                      className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/30 hover:bg-muted/60 rounded-lg border border-border/30"
                    >
                      {route}
                    </button>
                  )
                )}
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full h-12 text-base font-bold rounded-xl"
              onClick={handleFindRide}
            >
              Find a Ride
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </TabsContent>

          <TabsContent value="drive" className="space-y-5">
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Car className="w-7 h-7 text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground mb-1">
                Ready to earn?
              </p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Plenty of riders are looking for a ride right now. Start earning
                on your schedule.
              </p>
            </div>

            <Button
              variant="primary"
              className="w-full h-12 text-base font-bold rounded-xl"
              onClick={handleAcceptRide}
            >
              Find Passengers
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
