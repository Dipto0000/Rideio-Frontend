"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resetPassword } from "@/lib/actions/auth.actions"
import { Lock, Loader2, AlertCircle, ArrowLeft } from "lucide-react"

export default function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const password = form.get("password") as string
    const token = searchParams.get("token")

    if (!token) {
      setError("Invalid reset link")
      setLoading(false)
      return
    }

    const res = await resetPassword(token, password)
    if (!res.success) {
      setError(res.message || "Reset failed")
      setLoading(false)
      return
    }
    router.push("/auth/login?reset=success")
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <Link
          href="/"
          className="text-2xl font-bold text-primary tracking-tight inline-block mb-6"
        >
          Rideio
        </Link>
        <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Enter your new password below.
        </p>
      </div>
      <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              name="password"
              type="password"
              placeholder="New Password"
              required
              minLength={6}
              className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              minLength={6}
              className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl text-sm flex items-start gap-2.5 bg-red-50 border border-red-200 dark:bg-red-950/60 dark:border-red-800/50 dark:text-red-300">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full h-11 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
