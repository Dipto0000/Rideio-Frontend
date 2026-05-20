"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SocialButtons } from "./SocialButtons"
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { loginSchema } from "@/schemas"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [needsVerification, setNeedsVerification] = useState(false)
  const [resending, setResending] = useState(false)

  const rawCallbackUrl = searchParams.get("callbackUrl") || "/"
  const urlError = searchParams.get("error")

  // Normalize callbackUrl: extract pathname from full URL
  // e.g., "https://rideio.vercel.app/find-rides" → "/find-rides"
  let callbackUrl = rawCallbackUrl
  try {
    callbackUrl = new URL(rawCallbackUrl).pathname || "/"
  } catch {
    // Already a relative path, use as-is
  }

  const pageName = (() => {
    const path = callbackUrl.split("?")[0].replace(/^\//, "").split("/").filter(Boolean)

    // Known route patterns → friendly display names (no raw IDs or params)
    const routeMap: Record<string, string> = {
      "find-rides": "Find Rides",
      "create-ride": "Create a Ride",
      rides: "Ride Details",
      dashboard: "Dashboard",
      profile: "Profile Settings",
      notifications: "Notifications",
      subscription: "Subscription",
    }

    const base = path[0]
    if (base && routeMap[base]) {
      return routeMap[base]
    }

    // Fallback: filter out ID-like segments (MongoDB ObjectId, UUIDs, etc.)
    const friendly = path
      .filter((s) => !/^[0-9a-f]{24}$/i.test(s) && !/^[0-9a-f-]{36}$/i.test(s))
      .map((s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
      .join(" ")

    return friendly || "Home"
  })()
  const [showGooglePrompt, setShowGooglePrompt] = useState(false)

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setError("")
    setNeedsVerification(false)

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    // Client-side validation
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const path = issue.path[0] as string
        if (!errors[path]) errors[path] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        const msg = result.error.toLowerCase()
        if (msg.includes("verify your email")) {
          setNeedsVerification(true)
          setError("Please verify your email before signing in.")
          return
        }
        if (msg.includes("google") || msg.includes("set a password")) {
          setShowGooglePrompt(true)
          setError("This account was created with Google. Sign in with Google or set a password in your profile.")
          return
        }
        // Map NextAuth's generic error to a user-friendly message
        if (msg.includes("credentials") || msg.includes("credentialsignin")) {
          setError("Invalid email or password. Please try again.")
          return
        }
        // Use the actual error message from the backend if available
        setError(result.error || "Invalid email or password. Please try again.")
        return
      }

      toast.success("Signed in successfully!")
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
      {/* Callback redirect banner */}
      {callbackUrl && callbackUrl !== "/" && !urlError && (
        <div className="p-3.5 rounded-xl text-sm flex items-start gap-2.5 bg-secondary/10 border border-secondary/20 text-secondary dark:bg-secondary/20 dark:border-secondary/30">
          <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
          <p>Please sign in to access <strong>{pageName}</strong></p>
        </div>
      )}

      {/* Error banner from URL params (e.g. Google auth failure for drivers) */}
      {urlError && (
        <div className="p-3.5 rounded-xl text-sm flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/70 dark:border-red-800/50 dark:text-red-300">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{urlError}</p>
        </div>
      )}

      <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              className={`pl-10 h-11 bg-muted/20 rounded-xl transition-all ${
                fieldErrors.email
                  ? "border-destructive focus:border-destructive"
                  : "border-border/50 focus:border-secondary/50"
              }`}
              onChange={() => setFieldErrors((prev) => ({ ...prev, email: "" }))}
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive mt-1 ml-1">{fieldErrors.email}</p>
            )}
          </div>

        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
              className={`pl-10 h-11 bg-muted/20 rounded-xl transition-all ${
                fieldErrors.password
                  ? "border-destructive focus:border-destructive"
                  : "border-border/50 focus:border-secondary/50"
              }`}
              onChange={() => setFieldErrors((prev) => ({ ...prev, password: "" }))}
            />
            {fieldErrors.password && (
              <p className="text-xs text-destructive mt-1 ml-1">{fieldErrors.password}</p>
            )}
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
                ? "bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/70 dark:border-amber-700/40 dark:text-amber-200"
                : "bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/70 dark:border-red-800/50 dark:text-red-300"
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
              {showGooglePrompt && (
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: callbackUrl })}
                  className="mt-2 flex items-center gap-1.5 text-secondary hover:underline font-semibold text-xs"
                >
                  Sign in with Google instead
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
