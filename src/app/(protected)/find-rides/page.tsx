"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function FindRidesPage() {
  const { data: session } = useSession()
  const isDriver = session?.user.subRole === "DRIVER"

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-primary mb-2">Find Rides</h1>
      <p className="text-muted-foreground mb-8">
        {isDriver
          ? "Browse available ride requests in your area."
          : "Available ride requests will appear here."}
      </p>

      {isDriver ? (
        <div className="grid gap-4">
          {!session?.user.isSubscribed && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800 text-sm font-medium">
                Subscribe to start accepting rides — 700 BDT/month
              </p>
              <Button variant="primary" size="sm" className="mt-2">
                Subscribe Now
              </Button>
            </div>
          )}
          <div className="text-center p-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">No ride requests available yet.</p>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            Register as a Driver to accept ride requests.
          </p>
        </div>
      )}
    </div>
  )
}
