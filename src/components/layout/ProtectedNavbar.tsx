"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
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
import { NotificationBell } from "@/components/modules/Notifications/NotificationBell"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export function ProtectedNavbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = session?.user?.name
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
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium max-w-[120px] truncate hidden lg:inline">
                {session?.user?.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>

            {profileMenuOpen && (
              <div role="menu" aria-label="User menu" className="absolute right-0 top-full mt-1 w-48 rounded-xl border bg-card shadow-lg z-50 overflow-hidden py-1">
                <button
                  role="menuitem"
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
                  role="menuitem"
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
                  role="menuitem"
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
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
            className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
      )}
    </header>
  )
}
