"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { AdminSidebar } from "@/components/modules/Dashboard/AdminSidebar"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Car, CreditCard, Archive, Shield } from "lucide-react"

const mobileLinks = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/rides", label: "Rides", icon: Car },
  { href: "/dashboard/admin/subscriptions", label: "Subs", icon: CreditCard },
  { href: "/dashboard/admin/deleted", label: "Deleted", icon: Archive },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN"
  const accessToken = session?.user?.accessToken

  useEffect(() => {
    if (status === "loading") return
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
    ) {
      router.replace("/dashboard")
    }
  }, [accessToken, status])

  if (status === "loading" || !session) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Desktop sidebar */}
      <AdminSidebar isSuperAdmin={isSuperAdmin} />

      {/* Mobile top nav */}
      <div className="lg:hidden -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-1 pb-2 min-w-max">
          {mobileLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/dashboard/admin" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-secondary/10 text-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            )
          })}
          {isSuperAdmin && (
            <Link
              href="/dashboard/admin/super-admin/admins"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                pathname.startsWith("/dashboard/admin/super-admin")
                  ? "bg-secondary/10 text-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admins
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
