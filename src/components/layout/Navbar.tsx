"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="grid grid-cols-2 md:grid-cols-3 items-center px-6 py-4 md:px-12 bg-background border-b border-border">
      <div className="flex justify-start">
        <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
          Rideio
        </Link>
      </div>

      <div className="hidden md:flex items-center justify-center gap-8">
        <Link
          href="/find-rides"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          Find Rides
        </Link>
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
      </div>

      <div className="flex items-center justify-end gap-4">
        {status === "loading" ? (
          <Button variant="outline" disabled>
            Loading...
          </Button>
        ) : session ? (
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-sm text-muted-foreground">
              {session.user.name}
            </span>
            <Button variant="destructive" onClick={() => signOut({ redirect: false })}>
              Sign out
            </Button>
          </div>
        ) : (
          <Link href="/auth/role">
            <Button variant="primary">Sign up</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
