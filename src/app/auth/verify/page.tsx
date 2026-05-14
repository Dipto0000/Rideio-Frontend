"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { verifyEmail, resendVerification } from "@/lib/actions/auth.actions"
import { Mail, CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react"

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(
    token ? "verifying" : "idle"
  )
  const [message, setMessage] = useState("")
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (token) verify()
  }, [token])

  async function verify() {
    setStatus("verifying")
    const res = await verifyEmail(token!)
    if (res.success && res.data) {
      const { accessToken, refreshToken } = res.data
      if (accessToken) {
        try {
          const result = await signIn("token", {
            accessToken,
            refreshToken: refreshToken || "",
            redirect: false,
          })
          if (result?.ok) {
            setStatus("success")
            setMessage("Email verified! You're now signed in.")
            return
          }
        } catch {
          setStatus("success")
          setMessage("Email verified! You can now sign in.")
          return
        }
      }
      setStatus("success")
      setMessage("Email verified! You can now sign in.")
    } else {
      setStatus("error")
      setMessage(res.message || "Verification failed")
    }
  }

  async function resend() {
    if (!email) return
    setResending(true)
    const res = await resendVerification(email)
    setMessage(res.success ? "Verification email resent!" : "Failed to resend")
    setResending(false)
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-card p-8 sm:p-10 shadow-sm text-center">
      {status === "verifying" && (
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary mb-1">Verifying Email...</h1>
            <p className="text-sm text-muted-foreground">Please wait a moment</p>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-900/50 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary mb-1">Email Verified!</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <Button
            variant="primary"
            className="rounded-xl"
            onClick={() => router.push("/")}
          >
            Go to Home
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary mb-1">Verification Failed</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          {email && (
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={resend}
              disabled={resending}
            >
              {resending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                "Resend Verification Email"
              )}
            </Button>
          )}
        </div>
      )}

      {status === "idle" && (
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary mb-1">Check Your Email</h1>
            <p className="text-sm text-muted-foreground max-w-sm">
              We&apos;ve sent a verification link to{" "}
              <strong className="text-foreground">{email || "your email"}</strong>.
              Click the link to activate your account.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={resend}
              disabled={resending}
            >
              {resending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                "Resend Email"
              )}
            </Button>
            <Button
              variant="primary"
              className="rounded-xl"
              onClick={() => router.push("/auth/login")}
            >
              Back to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function VerifyFallback() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-8 sm:p-10 shadow-sm">
      <div className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-muted/50 animate-pulse" />
        <div className="h-7 w-40 bg-muted/50 animate-pulse rounded-lg" />
        <div className="h-4 w-64 bg-muted/50 animate-pulse rounded-lg" />
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-muted/50 animate-pulse rounded-xl" />
          <div className="h-10 w-32 bg-muted/50 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyContent />
    </Suspense>
  )
}
