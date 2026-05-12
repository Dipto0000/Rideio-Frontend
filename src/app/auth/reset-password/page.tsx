"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ResetPasswordPage() {
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

    try {
      const res = await fetch("/api/backend/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || "Reset failed")
        return
      }
      router.push("/auth/login?reset=success")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
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
