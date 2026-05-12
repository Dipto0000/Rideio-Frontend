"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CreateRideForm } from "@/components/modules/Ride/CreateRideForm"

export default function CreateRidePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isDriver = session?.user.subRole === "DRIVER"

  useEffect(() => {
    if (status === "loading") return
    if (isDriver) {
      router.replace("/find-rides")
    }
  }, [status, isDriver, router])

  if (status === "loading" || !session) return null

  if (isDriver) return null

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Create a Ride</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to post your trip and find a driver.
        </p>
      </div>
      <CreateRideForm />
    </div>
  )
}
