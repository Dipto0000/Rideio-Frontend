import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import { getDriverDashboard } from "@/lib/actions/dashboard.actions"
import { getSubscriptionStatus } from "@/lib/actions/subscription.actions"
import { DriverDashboardContent } from "./_components/DriverDashboardContent"

export const metadata: Metadata = {
  title: "Driver Dashboard",
  description: "Track your earnings, manage rides, and view your driver stats.",
}

export default async function DriverDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.subRole !== "DRIVER") {
    redirect("/dashboard")
  }

  const [dashRes, subRes] = await Promise.all([
    getDriverDashboard(session.user.accessToken),
    getSubscriptionStatus(session.user.accessToken),
  ])

  const initialData = dashRes.success && dashRes.data ? dashRes.data : {
    totalEarnings: 0,
    totalRidesCompleted: 0,
    averageRating: 0,
    totalReviews: 0,
    recentRides: [],
  }

  const initialSub = {
    isSubscribed: subRes.data?.isSubscribed ?? false,
    expiryDate: subRes.data?.expiryDate || null,
  }

  return <DriverDashboardContent initialData={initialData} initialSub={initialSub} />
}
