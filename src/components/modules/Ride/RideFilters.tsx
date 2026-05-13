"use client"

import { SlidersHorizontal, Search, X, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FilterValues {
  searchTerm?: string
  vehicleType?: string
  minFare?: number
  maxFare?: number
  sort?: string
}

interface RideFiltersProps {
  values: FilterValues
  onChange: (filters: FilterValues) => void
  onApply: () => void
  onReset: () => void
}

export function RideFiltersSidebar({ values, onChange, onApply, onReset }: RideFiltersProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-primary">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={values.searchTerm || ""}
              onChange={(e) => onChange({ ...values, searchTerm: e.target.value || undefined })}
              placeholder="Location..."
              className="pl-9 h-10 text-sm"
            />
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vehicle Type</label>
          <div className="grid grid-cols-2 gap-2">
            {["", "CAR", "BIKE"].map((v) => (
              <button
                key={v}
                onClick={() => onChange({ ...values, vehicleType: v || undefined })}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  (values.vehicleType || "") === v
                    ? "border-secondary bg-secondary/10 text-secondary font-medium"
                    : "border-border hover:border-secondary/50 text-muted-foreground"
                }`}
              >
                {v || "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Fare Range */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fare Range (BDT)</label>
          <div className="flex gap-2">
            <Input
              value={values.minFare || ""}
              onChange={(e) => onChange({ ...values, minFare: e.target.value ? Number(e.target.value) : undefined })}
              type="number"
              placeholder="Min"
              className="h-10 text-sm"
            />
            <span className="text-muted-foreground self-center">-</span>
            <Input
              value={values.maxFare || ""}
              onChange={(e) => onChange({ ...values, maxFare: e.target.value ? Number(e.target.value) : undefined })}
              type="number"
              placeholder="Max"
              className="h-10 text-sm"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            Sort By
          </label>
          <select
            value={values.sort || "-createdAt"}
            onChange={(e) => onChange({ ...values, sort: e.target.value })}
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="-createdAt">Newest First</option>
            <option value="proposedFare">Fare: Low to High</option>
            <option value="-proposedFare">Fare: High to Low</option>
            <option value="-distanceInKm">Distance: Longest</option>
            <option value="arrivalTime">Earliest Arrival</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="primary" size="sm" className="flex-1" onClick={onApply}>
            Apply
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <X className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function RideFiltersMobile({ values, onChange, onApply, onReset }: RideFiltersProps) {
  return (
    <div className="space-y-3 lg:hidden">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={values.searchTerm || ""}
            onChange={(e) => onChange({ ...values, searchTerm: e.target.value || undefined })}
            placeholder="Search location..."
            className="pl-9 h-10 bg-muted/30"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onApply}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={values.vehicleType || ""}
          onChange={(e) => onChange({ ...values, vehicleType: e.target.value || undefined })}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="">All Vehicles</option>
          <option value="CAR">Car</option>
          <option value="BIKE">Bike</option>
        </select>
        <select
          value={values.sort || "-createdAt"}
          onChange={(e) => onChange({ ...values, sort: e.target.value })}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="-createdAt">Newest</option>
          <option value="proposedFare">Fare ↑</option>
          <option value="-proposedFare">Fare ↓</option>
          <option value="-distanceInKm">Distance</option>
          <option value="arrivalTime">Arrival</option>
        </select>
        <div className="flex items-center gap-1">
          <Input
            value={values.minFare || ""}
            onChange={(e) => onChange({ ...values, minFare: e.target.value ? Number(e.target.value) : undefined })}
            type="number"
            placeholder="৳ min"
            className="h-9 w-20 text-sm"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            value={values.maxFare || ""}
            onChange={(e) => onChange({ ...values, maxFare: e.target.value ? Number(e.target.value) : undefined })}
            type="number"
            placeholder="৳ max"
            className="h-9 w-20 text-sm"
          />
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
