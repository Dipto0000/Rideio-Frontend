import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-options"
import { adminGetRides } from "@/lib/actions/admin.actions"
import { RidesContent } from "./_components/RidesContent"

export const metadata: Metadata = {
  title: "Rides | Admin Dashboard",
  description: "View and manage all ride requests.",
}

export default async function AdminRidesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard")
  }

  const res = await adminGetRides(session.user.accessToken, { page: "1", limit: "10" })

  return (
    <RidesContent
      initialRides={res.success ? res.data : []}
      initialMeta={res.success ? res.meta : null}
      accessToken={session.user.accessToken}
    />
  )
}
