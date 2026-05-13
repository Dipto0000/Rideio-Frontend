"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SocialButtons } from "./SocialButtons"
import { Mail, Loader2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [needsVerification, setNeedsVerification] = useState(false)
  const [resending, setResending] = useState(false)

  const callbackUrl = searchParams.get("callbackUrl") || "/"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setNeedsVerification(false)

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    try {
      const res = await fetch("/api/backend/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!data.success) {
        if (data.message?.toLowerCase().includes("verify your email")) {
          setNeedsVerification(true)
          setError("Please verify your email before signing in.")
          return
        }
        setError(data.message || "Invalid email or password")
        return
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function resendVerification() {
    const form = document.getElementById("login-form") as HTMLFormElement
    const email = new FormData(form).get("email") as string
    if (!email) return
    setResending(true)
    try {
      await fetch("/api/backend/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setError("")
      setNeedsVerification(false)
    } catch {
      /* ignore */
    }
    setResending(false)
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input name="email" type="email" placeholder="Email Address" required />
        <Input name="password" type="password" placeholder="Password" required />

        <div className="flex justify-end">
          <a
            href="/auth/forgot-password"
            className="text-sm text-secondary hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {error && (
          <div className={`p-3 rounded-lg text-sm ${
            needsVerification
              ? "bg-amber-50 border border-amber-200 text-amber-800"
              : "text-red-500"
          }`}>
            <p>{error}</p>
            {needsVerification && (
              <button
                type="button"
                onClick={resendVerification}
                disabled={resending}
                className="mt-2 flex items-center gap-1 text-secondary hover:underline font-medium"
              >
                {resending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Mail className="w-3 h-3" />
                )}
                Resend verification email
              </button>
            )}
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or continue with</span>
        </div>
      </div>

      <SocialButtons role="RIDER" />

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="/auth/role" className="text-secondary hover:underline font-medium">
          Sign up
        </a>
      </p>
    </div>
  )
}
