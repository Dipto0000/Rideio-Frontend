import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-options"
import { adminGetSubscriptions } from "@/lib/actions/admin.actions"
import { SubscriptionsContent } from "./_components/SubscriptionsContent"

export const metadata: Metadata = {
  title: "Subscriptions | Admin Dashboard",
  description: "View and manage payment records.",
}

export default async function AdminSubscriptionsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard")
  }

  const res = await adminGetSubscriptions(session.user.accessToken, { page: "1", limit: "10" })

  return (
    <SubscriptionsContent
      initialPayments={res.success ? res.data : []}
      initialMeta={res.success ? res.meta : null}
      accessToken={session.user.accessToken}
    />
  )
}
