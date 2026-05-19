"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Trash2, ExternalLink, Car } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/modules/Dashboard/Pagination"
import { adminGetRides, adminSoftDeleteRide } from "@/lib/actions/admin.actions"
import type { PaginationMeta } from "@/types"

const statusBadgeVariant: Record<string, "warning" | "info" | "success" | "destructive" | "outline"> = {
  PENDING: "warning",
  ACCEPTED: "info",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  CANCELLED: "destructive",
}

interface RideItem {
  _id: string
  from: { address: string }
  to: { address: string }
  status: string
  systemSuggestedFare: number
  riderId?: { _id: string; name: string }
  driverId?: { _id: string; name: string }
  createdAt: string
}

interface RidesContentProps {
  initialRides: RideItem[]
  initialMeta: PaginationMeta | null
  accessToken: string
}

export function RidesContent({ initialRides, initialMeta, accessToken }: RidesContentProps) {
  const router = useRouter()
  const [rides, setRides] = useState<RideItem[]>(initialRides)
  const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const fetchRides = useCallback((p: number, s: string) => {
    setLoading(true)
    const query: Record<string, string> = { page: String(p), limit: "10" }
    if (s) query.searchTerm = s
    adminGetRides(accessToken, query).then((res) => {
      if (res.success) {
        setRides(res.data)
        setMeta(res.meta)
      }
      setLoading(false)
    })
  }, [accessToken])

  // Handle page change (skip initial since data is server-fetched)
  useEffect(() => {
    if (page === 1 && search === "") return
    fetchRides(page, search)
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  function handleSearchChange(value: string) {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      fetchRides(1, value)
    }, 350)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  async function handleDelete(rideId: string) {
    setActionLoading(rideId)
    const res = await adminSoftDeleteRide(accessToken, rideId)
    if (res.success) {
      setRides((prev) => prev.filter((r) => r._id !== rideId))
    }
    setActionLoading(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rides</h1>
        <p className="text-muted-foreground text-sm mt-0.5">View and manage all ride requests.</p>
      </div>

      {/* Search with debounce */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by address..."
          className="pl-9 h-10"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : rides.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Car className="w-10 h-10 text-muted-foreground" />
          <p className="text-muted-foreground font-medium">No rides found</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Rider</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Fare</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rides.map((ride) => (
                    <TableRow key={ride._id}>
                      <TableCell>
                        <p className="text-sm text-foreground truncate max-w-[180px]">
                          {ride.from.address} → {ride.to.address}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{ride.riderId?.name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{ride.driverId?.name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(ride.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short" })}
                      </TableCell>
                      <TableCell className="text-right font-medium">৳{ride.systemSuggestedFare}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant[ride.status] || "outline"}>
                          {ride.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/rides/${ride._id}`)}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={actionLoading === ride._id}
                            onClick={() => handleDelete(ride._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {meta && <Pagination page={meta.page} totalPage={meta.totalPage} onPageChange={setPage} />}
    </div>
  )
}
