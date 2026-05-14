"use client"

import { useState, useCallback, useEffect, use } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { RideCard } from "./RideCard"
import { RideCardGridSkeleton } from "./RideCardSkeleton"
import { RideFiltersSidebar, RideFiltersMobile } from "./RideFilters"
import { acceptRide } from "@/lib/actions/ride.actions"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import type { Ride, PaginationMeta } from "@/types"

interface FilterValues {
  searchTerm?: string
  vehicleType?: string
  minFare?: number
  maxFare?: number
  sort?: string
}

function filterFromParams(sp: URLSearchParams): FilterValues {
  return {
    searchTerm: sp.get("searchTerm") || undefined,
    vehicleType: sp.get("vehicleType") || undefined,
    minFare: sp.get("minFare") ? Number(sp.get("minFare")) : undefined,
    maxFare: sp.get("maxFare") ? Number(sp.get("maxFare")) : undefined,
    sort: sp.get("sort") || undefined,
  }
}

export function RideList() {
  const { data: session } = useSession()
  const sp = useSearchParams()
  const searchParams = sp ?? new URLSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [rides, setRides] = useState<Ride[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPage: 0 })
  const [loading, setLoading] = useState(true)
  const [acceptLoading, setAcceptLoading] = useState<string | null>(null)
  const [filterValues, setFilterValues] = useState<FilterValues>(() => filterFromParams(searchParams))

  const page = Number(searchParams.get("page")) || 1

  useEffect(() => {
    fetchRides()
  }, [searchParams.toString()])

  useEffect(() => {
    setFilterValues(filterFromParams(searchParams))
  }, [searchParams])

  async function fetchRides() {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      if (!params.has("limit")) params.set("limit", "10")
      const res = await fetch(`/api/backend/rides?${params}`)
      const data = await res.json()
      if (data.success) {
        setRides(data.data)
        setMeta(data.meta)
      }
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  function applyFilters() {
    const params = new URLSearchParams()
    params.set("page", "1")
    params.set("limit", "10")
    if (filterValues.searchTerm) params.set("searchTerm", filterValues.searchTerm)
    if (filterValues.vehicleType) params.set("vehicleType", filterValues.vehicleType)
    if (filterValues.minFare !== undefined) params.set("minFare", String(filterValues.minFare))
    if (filterValues.maxFare !== undefined) params.set("maxFare", String(filterValues.maxFare))
    if (filterValues.sort) params.set("sort", filterValues.sort)
    router.replace(`${pathname}?${params}`)
  }

  function resetFilters() {
    setFilterValues({})
    router.replace(pathname)
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(newPage))
    if (!params.has("limit")) params.set("limit", "10")
    router.replace(`${pathname}?${params}`)
  }

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
      <aside className="hidden lg:block w-72 shrink-0">
        <RideFiltersSidebar
          values={filterValues}
          onChange={setFilterValues}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      </aside>

      <div className="flex-1 space-y-4">
        <RideFiltersMobile
          values={filterValues}
          onChange={setFilterValues}
          onApply={applyFilters}
          onReset={resetFilters}
        />

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
