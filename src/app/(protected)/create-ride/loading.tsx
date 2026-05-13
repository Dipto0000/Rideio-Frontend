import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function CreateRideLoading() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Map skeleton */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Form fields skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>

      {/* Submit button */}
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  )
}
