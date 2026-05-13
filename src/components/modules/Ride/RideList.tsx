"use client"

import { useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { RideCard } from "./RideCard"
import { RideCardGridSkeleton } from "./RideCardSkeleton"
import { RideFiltersSidebar, RideFiltersMobile } from "./RideFilters"
import { acceptRide } from "@/lib/actions/ride.actions"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import type { Ride, PaginationMeta } from "@/types"

interface RideListProps {
  initialRides: Ride[]
  initialMeta: PaginationMeta
}

interface FilterValues {
  searchTerm?: string
  vehicleType?: string
  minFare?: number
  maxFare?: number
  sort?: string
}

export function RideList({ initialRides, initialMeta }: RideListProps) {
  const { data: session } = useSession()
  const [rides, setRides] = useState<Ride[]>(initialRides)
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta)
  const [loading, setLoading] = useState(false)
  const [acceptLoading, setAcceptLoading] = useState<string | null>(null)
  const [filterValues, setFilterValues] = useState<FilterValues>({})

  function buildParams(filters: FilterValues, page: number) {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", "10")
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm)
    if (filters.vehicleType) params.set("vehicleType", filters.vehicleType)
    if (filters.minFare !== undefined) params.set("minFare", String(filters.minFare))
    if (filters.maxFare !== undefined) params.set("maxFare", String(filters.maxFare))
    if (filters.sort) params.set("sort", filters.sort)
    return params
  }

  async function fetchWithFilters(filters: FilterValues, page: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/backend/rides?${buildParams(filters, page)}`)
      const data = await res.json()
      if (data.success) {
        setRides(data.data)
        setMeta(data.meta)
      }
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  const handleFilterChange = useCallback((values: FilterValues) => {
    setFilterValues(values)
  }, [])

  const applyFilters = useCallback(() => {
    fetchWithFilters(filterValues, 1)
  }, [filterValues])

  const resetFilters = useCallback(() => {
    setFilterValues({})
    fetchWithFilters({}, 1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    fetchWithFilters(filterValues, page)
  }, [filterValues])

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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar - desktop only */}
      <aside className="hidden lg:block w-72 shrink-0">
        <RideFiltersSidebar
          values={filterValues}
          onChange={handleFilterChange}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 space-y-4">
        {/* Mobile filters */}
        <RideFiltersMobile
          values={filterValues}
          onChange={handleFilterChange}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        {/* Ride list */}
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
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Showing {meta.page}-{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} rides
            </p>
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
          </div>
        )}

        {/* Pagination */}
        {meta.totalPage > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => handlePageChange(meta.page - 1)}
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
              onClick={() => handlePageChange(meta.page + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
