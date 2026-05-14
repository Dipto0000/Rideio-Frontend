import { Suspense } from "react"
import { RideListingView } from "./RideListingView"
import { Skeleton } from "@/components/ui/skeleton"

function FindRidesFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function FindRidesPage() {
  return (
    <Suspense fallback={<FindRidesFallback />}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Find Rides</h1>
          <p className="text-muted-foreground mt-1">
            Browse available ride requests and accept the ones that suit you best.
          </p>
        </div>
        <RideListingView />
      </div>
    </Suspense>
  )
}
