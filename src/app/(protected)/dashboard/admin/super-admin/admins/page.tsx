import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-options"
import { adminGetUsers } from "@/lib/actions/admin.actions"
import { AdminsContent } from "./_components/AdminsContent"

export const metadata: Metadata = {
  title: "Admin Management | Admin Dashboard",
  description: "Create and remove admin accounts.",
}

export default async function SuperAdminAdminsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard/admin")
  }

  const res = await adminGetUsers(session.user.accessToken, { role: "ADMIN", limit: "50" })

  return (
    <AdminsContent
      initialAdmins={res.success ? res.data : []}
      accessToken={session.user.accessToken}
    />
  )
}
