import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import { getNotifications } from "@/lib/actions/notification.actions"
import { NotificationsContent } from "./_components/NotificationsContent"

export const metadata: Metadata = {
  title: "Notifications",
  description: "View your ride updates, alerts, and account notifications.",
}

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const res = await getNotifications(session.user.accessToken, 1, 15)

  return (
    <NotificationsContent
      initialNotifications={res.success ? res.data : []}
      initialMeta={res.success ? res.meta : null}
      accessToken={session.user.accessToken}
    />
  )
}
