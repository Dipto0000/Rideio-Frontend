"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function NewUserPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-md mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-primary">Account Created!</h1>
      <p className="text-muted-foreground">
        Welcome to Rideio! We&apos;ve sent a verification email. Please verify your email address to get started.
      </p>
      <Button variant="primary" onClick={() => router.push("/")}>
        Go to Home
      </Button>
    </div>
  )
}
