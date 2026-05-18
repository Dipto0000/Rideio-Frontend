import { type ReactNode } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { ProtectedNavbar } from "@/components/layout/ProtectedNavbar"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <ProtectedNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}
