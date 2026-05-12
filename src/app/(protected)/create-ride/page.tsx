"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CreateRidePage() {
  const { data: session } = useSession()
  const isRider = session?.user.subRole === "RIDER"

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-primary mb-2">Create a Ride</h1>
      <p className="text-muted-foreground mb-8">
        {isRider
          ? "Fill in the details below to create your ride post."
          : "You need to be registered as a Rider to create ride posts."}
      </p>

      {isRider ? (
        <form className="flex flex-col gap-4">
          <Input name="from" placeholder="Pickup Location" required />
          <Input name="to" placeholder="Drop-off Location" required />
          <Input name="date" type="datetime-local" required />
          <Input name="seats" type="number" placeholder="Number of seats needed" min={1} required />
          <textarea
            name="notes"
            placeholder="Additional notes (optional)"
            className="flex min-h-[100px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <Button variant="primary" className="w-full">
            Post Ride
          </Button>
        </form>
      ) : (
        <div className="text-center p-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            Switch to a Rider account to create ride posts.
          </p>
        </div>
      )}
    </div>
  )
}
