"use client"

import { MapPin, ArrowRight } from "lucide-react"
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
    <Card className="w-full max-w-md shadow-xl border-none">
      <CardContent className="p-8">
        <Tabs defaultValue="ride" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/20 rounded-lg">
            <TabsTrigger
              value="ride"
              className="px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground rounded-md transition-colors"
            >
              I need a Ride
            </TabsTrigger>
            <TabsTrigger
              value="drive"
              className="px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground rounded-md transition-colors"
            >
              I want to Drive
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[280px]">
            <TabsContent value="ride" className="space-y-6 h-[280px] overflow-y-auto">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                <Input
                  placeholder="Where to?"
                  className="pl-10 h-14 bg-muted/30 border-none placeholder:text-muted-foreground/60 text-base font-medium"
                />
              </div>

              <Button
                variant="primary"
                className="w-full h-14 text-lg font-bold"
                onClick={handleFindRide}
              >
                Find A Ride
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </TabsContent>

            <TabsContent value="drive" className="space-y-6 h-[280px] overflow-y-auto">
              <div className="text-center pt-8">
                <p className="text-xl font-medium text-muted-foreground">
                  Plenty of rides waiting for you
                </p>
              </div>

              <Button
                variant="primary"
                className="w-full h-14 text-lg font-bold"
                onClick={handleAcceptRide}
              >
                Accept Ride
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
