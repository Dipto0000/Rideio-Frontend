import { Skeleton } from "@/components/ui/skeleton"

export function NotificationListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-5 w-64" />
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  )
}
