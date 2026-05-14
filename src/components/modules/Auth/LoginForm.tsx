"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SocialButtons } from "./SocialButtons"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"

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
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
          />
        </div>

        <div className="flex justify-end">
          <a
            href="/auth/forgot-password"
            className="text-xs text-secondary hover:underline font-medium"
          >
            Forgot password?
          </a>
        </div>

        {error && (
          <div
            className={`p-3.5 rounded-xl text-sm flex items-start gap-2.5 ${
              needsVerification
                ? "bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-300"
                : "bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400"
            }`}
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p>{error}</p>
              {needsVerification && (
                <button
                  type="button"
                  onClick={resendVerification}
                  disabled={resending}
                  className="mt-2 flex items-center gap-1.5 text-secondary hover:underline font-semibold text-xs"
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
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground font-medium">
            or continue with
          </span>
        </div>
      </div>

      <SocialButtons />
    </div>
  )
}
