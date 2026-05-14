"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"

export default function NewUserPage() {
  const router = useRouter()

  return (
    <div className="rounded-2xl border border-border/40 bg-card p-8 sm:p-10 shadow-sm text-center">
      <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-900/50 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="text-xl font-bold text-primary mb-2">Account Created!</h1>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
        Welcome to Rideio! We&apos;ve sent a verification email. Please verify your
        email address to get started.
      </p>
      <Button
        variant="primary"
        className="rounded-xl"
        onClick={() => router.push("/")}
      >
        Go to Home
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
