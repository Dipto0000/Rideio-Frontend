"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { NotificationBell } from "@/components/modules/Notifications/NotificationBell"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login?callbackUrl=" + encodeURIComponent(window.location.pathname))
    }
  }, [status, router])

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  if (!session) return null

  const initials = session.user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  const handleLogout = async () => {
    await signOut({ redirect: false })
    window.location.href = "/"
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-lg font-bold text-foreground tracking-tight"
            >
              Rideio
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => router.push(link.href)}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />

            {/* Profile dropdown */}
            <div ref={profileRef} className="relative hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={(session.user as any)?.picture || ""} />
                  <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium max-w-[120px] truncate hidden lg:inline">
                  {session.user?.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border bg-card shadow-lg z-50 overflow-hidden py-1">
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => {
                      setProfileMenuOpen(false)
                      router.push("/profile")
                    }}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => {
                      setProfileMenuOpen(false)
                      router.push("/dashboard")
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <hr className="my-1 border-border" />
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t bg-background px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push(link.href)
                }}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Button>
            ))}
            <hr className="border-border my-2" />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => {
                setMobileMenuOpen(false)
                router.push("/profile")
              }}
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}
