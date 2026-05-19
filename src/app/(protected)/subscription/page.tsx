import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import { getSubscriptionStatus, getPaymentHistory } from "@/lib/actions/subscription.actions"
import { SubscriptionContent } from "./_components/SubscriptionContent"

export const metadata: Metadata = {
  title: "Subscription",
  description: "Manage your driver subscription to start accepting rides.",
}

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const [statusRes, historyRes] = await Promise.all([
    getSubscriptionStatus(session.user.accessToken),
    getPaymentHistory(session.user.accessToken),
  ])

  return (
    <SubscriptionContent
      initialStatus={statusRes.success ? statusRes.data : null}
      initialPayments={historyRes.success ? historyRes.data : []}
      initialMeta={historyRes.success ? historyRes.meta : null}
    />
  )
}
