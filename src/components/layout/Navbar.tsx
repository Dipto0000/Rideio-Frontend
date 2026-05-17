"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { useSession, signOut } from "next-auth/react"
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Car,
  PlusCircle,
  Info,
  Bell,
} from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const subRole = session?.user.subRole
  const isRider = subRole === "RIDER"
  const isDriver = subRole === "DRIVER"

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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-foreground tracking-tight shrink-0"
        >
          Rideio
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {session && (
            <>
              {isRider && (
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5 shadow-md shadow-primary/15"
                  onClick={() => router.push("/create-ride")}
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Ride
                </Button>
              )}
              {isDriver && (
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5 shadow-md shadow-primary/15"
                  onClick={() => router.push("/find-rides")}
                >
                  <Car className="w-4 h-4" />
                  Find Rides
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </>
          )}
          {!session && (
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/15"
              onClick={() => router.push("/find-rides")}
            >
              <Car className="w-4 h-4" />
              Find Rides
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => router.push("/how-it-works")}
          >
            <Info className="w-4 h-4" />
            How it Works
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => router.push("/about")}
          >
            <Info className="w-4 h-4" />
            About Us
          </Button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              {/* Desktop profile dropdown */}
              <div ref={profileRef} className="relative hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  aria-haspopup="menu"
                  aria-expanded={profileMenuOpen}
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium max-w-[100px] truncate hidden lg:inline">
                    {session.user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>

                {profileMenuOpen && (
                  <div role="menu" aria-label="User menu" className="absolute right-0 top-full mt-1 w-44 rounded-xl border bg-card shadow-lg z-50 overflow-hidden py-1">
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
                    <button
                      role="menuitem"
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        router.push("/notifications")
                      }}
                    >
                      <Bell className="w-4 h-4" />
                      Notifications
                    </button>
                    <hr className="my-1 border-border" />
                    <button
                      role="menuitem"
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile: Create / Find Rides button */}
              <div className="md:hidden">
                {isRider && (
                  <Button variant="primary" size="sm" onClick={() => router.push("/create-ride")}>
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Ride
                  </Button>
                )}
                {isDriver && (
                  <Button variant="primary" size="sm" onClick={() => router.push("/find-rides")}>
                    <Car className="w-4 h-4 mr-1" />
                    Find
                  </Button>
                )}
                {!isRider && !isDriver && (
                  <Button variant="primary" size="sm" onClick={() => router.push("/dashboard")}>
                    Dashboard
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/role">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Theme toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
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
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-1">
          {!session && (
            <>
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center gap-2"
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push("/find-rides")
                }}
              >
                <Car className="w-4 h-4" />
                Find Rides
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push("/how-it-works")
                }}
              >
                <Info className="w-4 h-4" />
                How it Works
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push("/about")
                }}
              >
                <Info className="w-4 h-4" />
                About Us
              </Button>
              <div className="px-3 py-2">
                <ThemeToggle />
              </div>
              <hr className="border-border my-2" />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push("/auth/login")
                }}
              >
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push("/auth/role")
                }}
              >
                Sign Up
              </Button>
            </>
          )}
          {session && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push("/dashboard")
                }}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              {isRider && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    router.push("/create-ride")
                  }}
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Ride
                </Button>
              )}
              {isDriver && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    router.push("/find-rides")
                  }}
                >
                  <Car className="w-4 h-4" />
                  Find Rides
                </Button>
              )}
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
                className="w-full justify-start gap-2"
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push("/notifications")
                }}
              >
                <Bell className="w-4 h-4" />
                Notifications
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push("/how-it-works")
                }}
              >
                <Info className="w-4 h-4" />
                How it Works
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push("/about")
                }}
              >
                <Info className="w-4 h-4" />
                About Us
              </Button>
              <hr className="border-border my-2" />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
