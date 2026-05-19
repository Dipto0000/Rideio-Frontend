import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import { getRiderDashboard } from "@/lib/actions/dashboard.actions"
import { RiderDashboardContent } from "./_components/RiderDashboardContent"

export const metadata: Metadata = {
  title: "Rider Dashboard",
  description: "View your rides, track active trips, and manage your ride history.",
}

export default async function RiderDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.subRole !== "RIDER") {
    redirect("/dashboard")
  }

  const res = await getRiderDashboard(session.user.accessToken)
  const initialData = res.success && res.data ? res.data : {
    totalRidesPosted: 0,
    activeRides: 0,
    completedRides: 0,
    cancelledRides: 0,
    recentRides: [],
  }

  return <RiderDashboardContent initialData={initialData} />
}
