import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminSubscriptionsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Card>
        <CardContent className="p-0">
          <Skeleton className="h-12 w-full rounded-t-lg" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-center gap-4 pt-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  )
}
