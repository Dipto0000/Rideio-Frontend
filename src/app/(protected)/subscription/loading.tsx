import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SubscriptionLoading() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Status banner skeleton */}
      <Skeleton className="h-20 w-full rounded-xl" />

      {/* Plan card */}
      <Card>
        <CardHeader className="text-center pb-4 space-y-2">
          <Skeleton className="h-7 w-32 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-1">
            <Skeleton className="h-12 w-24 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>

          <div className="space-y-3 max-w-sm mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>

          <Skeleton className="h-12 w-full rounded-lg" />

          <Skeleton className="h-3 w-64 mx-auto" />
        </CardContent>
      </Card>

      {/* Payment history skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
