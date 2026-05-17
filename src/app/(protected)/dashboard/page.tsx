import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { Skeleton } from "@/components/ui/skeleton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const { role, subRole } = session.user

  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    redirect("/dashboard/admin")
  } else if (subRole === "DRIVER") {
    redirect("/dashboard/driver")
  } else if (subRole === "RIDER") {
    redirect("/dashboard/rider")
  }

  // Fallback skeleton (should never render since we redirect)
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
