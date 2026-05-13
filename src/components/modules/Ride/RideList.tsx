"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { RideCard } from "./RideCard"
import { RideCardGridSkeleton } from "./RideCardSkeleton"
import { RideFilters } from "./RideFilters"
import { acceptRide } from "@/lib/actions/ride.actions"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import type { Ride, PaginationMeta } from "@/types"

interface RideListProps {
  initialRides: Ride[]
  initialMeta: PaginationMeta
}

export function RideList({ initialRides, initialMeta }: RideListProps) {
  const { data: session } = useSession()
  const [rides, setRides] = useState<Ride[]>(initialRides)
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta)
  const [loading, setLoading] = useState(false)
  const [acceptLoading, setAcceptLoading] = useState<string | null>(null)
  const [filters, setFilters] = useState<Record<string, string | undefined>>({})

  async function fetchRides(page: number) {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", "10")
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm)
    if (filters.vehicleType) params.set("vehicleType", filters.vehicleType)

    try {
      const res = await fetch(`/api/backend/rides?${params}`)
      const data = await res.json()
      if (data.success) {
        setRides(data.data)
        setMeta(data.meta)
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = useCallback((f: Record<string, string | undefined>) => {
    setFilters(f)
    const params = new URLSearchParams()
    params.set("page", "1")
    params.set("limit", "10")
    if (f.searchTerm) params.set("searchTerm", f.searchTerm)
    if (f.vehicleType) params.set("vehicleType", f.vehicleType)
    if (f.minFare) params.set("minFare", f.minFare)
    if (f.maxFare) params.set("maxFare", f.maxFare)

    setLoading(true)
    fetch(`/api/backend/rides?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setRides(data.data)
          setMeta(data.meta)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleAccept(rideId: string) {
    if (!session?.user.accessToken) return
    setAcceptLoading(rideId)
    const res = await acceptRide(rideId, session.user.accessToken)
    if (res.success) {
      setRides((prev) => prev.filter((r) => r._id !== rideId))
    }
    setAcceptLoading(null)
  }

  return (
    <div className="space-y-6">
      <RideFilters onFilter={handleFilter} />

      {loading ? (
        <RideCardGridSkeleton count={5} />
      ) : rides.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground font-medium">No rides found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {rides.map((ride) => (
            <RideCard
              key={ride._id}
              ride={ride}
              onAccept={handleAccept}
              acceptLoading={acceptLoading === ride._id}
            />
          ))}
        </div>
      )}

      {meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() => fetchRides(meta.page - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.totalPage}
            onClick={() => fetchRides(meta.page + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
