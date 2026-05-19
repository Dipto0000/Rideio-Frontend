import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-options"
import { adminGetUsers } from "@/lib/actions/admin.actions"
import { UsersContent } from "./_components/UsersContent"

export const metadata: Metadata = {
  title: "Users | Admin Dashboard",
  description: "Manage all registered users.",
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard")
  }

  const res = await adminGetUsers(session.user.accessToken, { page: "1", limit: "10" })

  return (
    <UsersContent
      initialUsers={res.success ? res.data : []}
      initialMeta={res.success ? res.meta : null}
      accessToken={session.user.accessToken}
    />
  )
}
