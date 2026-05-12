"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RideFiltersProps {
  onFilter: (filters: {
    searchTerm?: string
    vehicleType?: string
    minFare?: number
    maxFare?: number
  }) => void
}

export function RideFilters({ onFilter }: RideFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [minFare, setMinFare] = useState("")
  const [maxFare, setMaxFare] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  function apply() {
    onFilter({
      searchTerm: searchTerm || undefined,
      vehicleType: vehicleType || undefined,
      minFare: minFare ? Number(minFare) : undefined,
      maxFare: maxFare ? Number(maxFare) : undefined,
    })
  }

  function reset() {
    setSearchTerm("")
    setVehicleType("")
    setMinFare("")
    setMaxFare("")
    onFilter({})
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              onFilter({ searchTerm: e.target.value || undefined })
            }}
            placeholder="Search by location..."
            className="pl-9 h-10 bg-muted/30"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {showAdvanced && (
        <div className="flex flex-wrap items-end gap-3 p-4 bg-muted/20 rounded-lg border border-border">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="flex h-9 w-32 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">All</option>
              <option value="CAR">Car</option>
              <option value="BIKE">Bike</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Min Fare</label>
            <Input
              value={minFare}
              onChange={(e) => setMinFare(e.target.value)}
              type="number"
              placeholder="৳ min"
              className="h-9 w-24 bg-background"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Max Fare</label>
            <Input
              value={maxFare}
              onChange={(e) => setMaxFare(e.target.value)}
              type="number"
              placeholder="৳ max"
              className="h-9 w-24 bg-background"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={apply}>
              Apply
            </Button>
            <Button variant="outline" size="sm" onClick={reset}>
              <X className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
