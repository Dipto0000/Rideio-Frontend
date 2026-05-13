"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { verifyEmail, resendVerification } from "@/lib/actions/auth.actions"
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function VerifyPage() {
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
    <div className="flex flex-col items-center gap-6 p-8 max-w-md mx-auto text-center">
      {status === "verifying" && (
        <>
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Verifying Email...</h1>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Email Verified!</h1>
          <p className="text-muted-foreground">{message}</p>
          <Button variant="primary" onClick={() => router.push("/")}>
            Go to Home
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Verification Failed</h1>
          <p className="text-muted-foreground">{message}</p>
          {email && (
            <Button variant="outline" onClick={resend} disabled={resending}>
              {resending ? "Sending..." : "Resend Verification Email"}
            </Button>
          )}
        </>
      )}

      {status === "idle" && (
        <>
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Check Your Email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to <strong>{email || "your email"}</strong>.
            Click the link to activate your account.
          </p>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={resend} disabled={resending}>
              {resending ? "Sending..." : "Resend Email"}
            </Button>
            <Button variant="primary" onClick={() => router.push("/auth/login")}>
              Back to Login
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
