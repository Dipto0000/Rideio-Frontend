"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=" + encodeURIComponent(window.location.pathname))
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  return <>{children}</>
}
