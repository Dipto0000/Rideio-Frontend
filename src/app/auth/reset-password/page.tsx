"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { resetPassword } from "@/lib/actions/auth.actions"

function ResetPasswordContent() {
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
    <div className="flex flex-col gap-6 p-8 max-w-md mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
        <p className="text-muted-foreground mt-1 text-sm">Enter your new password.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input name="password" type="password" placeholder="New Password" required minLength={6} />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          minLength={6}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  )
}

function ResetPasswordFallback() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-md mx-auto w-full">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
