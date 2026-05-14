"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession, signOut } from "next-auth/react"

export function Navbar() {
  const { data: session, status } = useSession()
  const subRole = session?.user.subRole
  const isRider = subRole === "RIDER"
  const isDriver = subRole === "DRIVER"

  return (
    <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-background border-b border-border">
      <Link href="/" className="text-2xl font-bold text-primary tracking-tight shrink-0">
        Rideio
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {status === "loading" ? (
          <div className="flex gap-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : (
          <>
            {session && !isDriver && (
              <Link
                href="/create-ride"
                className="text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors"
              >
                Create Ride
              </Link>
            )}
            {session && isDriver && (
              <Link
                href="/find-rides"
                className="text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors"
              >
                Find Rides
              </Link>
            )}
            {session && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
            {!session && (
              <Link
                href="/find-rides"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Find Rides
              </Link>
            )}
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {status === "loading" ? (
          <Skeleton className="h-9 w-24 rounded-md" />
        ) : session ? (
          <>
            {!isDriver && (
              <Link href="/create-ride">
                <Button variant="primary" size="sm">Create Ride</Button>
              </Link>
            )}
            {isDriver && (
              <Link href="/find-rides" className="md:hidden">
                <Button variant="primary" size="sm">Find Rides</Button>
              </Link>
            )}
            <span className="hidden md:block text-sm text-muted-foreground truncate max-w-[120px]">
              {session.user.name}
            </span>
            <Button variant="destructive" size="sm" onClick={() => signOut({ redirect: false })}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Link href="/find-rides" className="md:hidden">
              <Button variant="outline" size="sm">Find Rides</Button>
            </Link>
            <Link href="/auth/role">
              <Button variant="primary">Sign up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
