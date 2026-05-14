"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) return

    const role = session.user.role
    const subRole = session.user.subRole

    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      router.replace("/dashboard/admin")
    } else if (subRole === "DRIVER") {
      router.replace("/dashboard/driver")
    } else if (subRole === "RIDER") {
      router.replace("/dashboard/rider")
    }
  }, [session, status, router])

  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-5 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}
