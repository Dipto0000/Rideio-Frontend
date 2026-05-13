import { Skeleton } from "@/components/ui/skeleton"
import { RideCardGridSkeleton } from "@/components/modules/Ride/RideCardSkeleton"

export default function FindRidesLoading() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar skeleton - desktop */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </aside>
        {/* Main content */}
        <div className="flex-1">
          <RideCardGridSkeleton count={5} />
        </div>
      </div>
    </div>
  )
}
