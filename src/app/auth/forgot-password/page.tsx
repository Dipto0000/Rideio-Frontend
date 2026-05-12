"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { forgotPassword } from "@/lib/actions/auth.actions"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string

    const res = await forgotPassword(email)
    if (!res.success) {
      setError(res.message || "Request failed")
      setLoading(false)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-primary">Check Your Email</h1>
        <p className="text-muted-foreground">
          We&apos;ve sent a password reset link to your email address.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-md mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold text-primary">Forgot Password</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input name="email" type="email" placeholder="Email Address" required />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
      <a href="/auth/login" className="text-sm text-secondary hover:underline text-center">
        Back to login
      </a>
    </div>
  )
}
