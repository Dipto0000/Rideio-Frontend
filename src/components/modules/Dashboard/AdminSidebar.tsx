"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Car, CreditCard, Archive, Shield, ChevronLeft } from "lucide-react"

const adminLinks = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/rides", label: "Rides", icon: Car },
  { href: "/dashboard/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/dashboard/admin/deleted", label: "Deleted Records", icon: Archive },
]

const superAdminLinks = [
  { href: "/dashboard/admin/super-admin/admins", label: "Admin Management", icon: Shield },
]

export function AdminSidebar({ isSuperAdmin }: { isSuperAdmin?: boolean }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <nav className="space-y-1">
          {adminLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/dashboard/admin" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-secondary/10 text-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}

          {isSuperAdmin && (
            <>
              <div className="pt-4 pb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                  Super Admin
                </p>
              </div>
              {superAdminLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-secondary/10 text-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                )
              })}
            </>
          )}
        </nav>
      </div>
    </aside>
  )
}
