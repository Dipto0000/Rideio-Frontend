"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { RideList } from "@/components/modules/Ride/RideList"
import { RideCardGridSkeleton } from "@/components/modules/Ride/RideCardSkeleton"
import { Button } from "@/components/ui/button"
import type { Ride, PaginationMeta } from "@/types"

export function FindRidesView() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isDriver = session?.user.subRole === "DRIVER"
  const isRider = session?.user.subRole === "RIDER"
  const [rides, setRides] = useState<Ride[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (isRider) {
      router.replace("/create-ride")
      return
    }
    fetch("/api/backend/rides?page=1&limit=10")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setRides(data.data)
          setMeta(data.meta)
        }
      })
      .finally(() => setLoading(false))
  }, [status, isRider, router])

  if (status === "loading" || loading) {
    return <RideCardGridSkeleton count={5} />
  }

  if (!session || isRider) return null

  if (!session?.user.isSubscribed) {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <p className="text-amber-800 font-medium mb-3">
            Subscribe to start accepting rides — 700 BDT/month
          </p>
          <Button variant="primary" onClick={() => router.push("/subscription")}>
            Subscribe Now
          </Button>
        </div>
        <RideList initialRides={rides} initialMeta={meta!} />
      </div>
    )
  }

  return <RideList initialRides={rides} initialMeta={meta!} />
}
