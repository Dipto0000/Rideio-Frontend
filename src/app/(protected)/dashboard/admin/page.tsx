import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import { getAdminDashboard } from "@/lib/actions/dashboard.actions"
import { AdminDashboardContent } from "./_components/AdminDashboardContent"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Platform overview, user management, and ride analytics.",
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard")
  }

  const res = await getAdminDashboard(session.user.accessToken)
  const initialData = res.success && res.data ? res.data : {
    totalUsers: 0,
    totalDrivers: 0,
    totalRides: 0,
    totalRevenue: 0,
    newSubscriptionsThisMonth: 0,
    ridesByStatus: {},
    topRatedDrivers: [],
    recentRides: [],
  }

  return <AdminDashboardContent initialData={initialData} />
}
