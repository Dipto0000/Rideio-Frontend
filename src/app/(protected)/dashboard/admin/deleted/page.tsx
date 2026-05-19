import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-options"
import { adminGetDeletedRecords } from "@/lib/actions/admin.actions"
import { DeletedContent } from "./_components/DeletedContent"

export const metadata: Metadata = {
  title: "Deleted Records | Admin Dashboard",
  description: "Audit log of all soft-deleted resources.",
}

export default async function AdminDeletedRecordsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard")
  }

  const res = await adminGetDeletedRecords(session.user.accessToken, { page: "1", limit: "10" })

  return (
    <DeletedContent
      initialRecords={res.success ? res.data : []}
      initialMeta={res.success ? res.meta : null}
      accessToken={session.user.accessToken}
    />
  )
}
