import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function RideDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Skeleton className="h-4 w-28 mb-6" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map skeleton */}
          <Skeleton className="h-64 md:h-80 w-full rounded-xl" />

          {/* Quick info cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-4 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Route skeleton */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <Skeleton className="h-5 w-16" />
              <div className="flex gap-3 items-start">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="w-0.5 h-12" />
                </div>
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Rider info */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-5 w-16" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle info */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>

          {/* Fare details */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          {/* Action button */}
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
