"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { verifyEmail, resendVerification } from "@/lib/actions/auth.actions"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(
    token ? "verifying" : "idle"
  )
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (token) {
      verify()
    }
  }, [token])

  async function verify() {
    setStatus("verifying")
    const res = await verifyEmail(token!)
    if (res.success) {
      setStatus("success")
      setMessage("Email verified successfully!")
    } else {
      setStatus("error")
      setMessage(res.message || "Verification failed")
    }
  }

  async function resend() {
    if (!email) return
    const res = await resendVerification(email)
    setMessage(res.success ? "Verification email resent!" : "Failed to resend")
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-md mx-auto text-center">
      {status === "verifying" && (
        <>
          <div className="w-16 h-16 rounded-full bg-muted animate-pulse flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary">Verifying Email...</h1>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary">Email Verified!</h1>
          <p className="text-muted-foreground">{message}</p>
          <Button variant="primary" onClick={() => router.push("/auth/login")}>
            Sign In Now
          </Button>
        </>
      )}

      {(status === "error" || status === "idle") && (
        <>
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary">Verification Failed</h1>
          <p className="text-muted-foreground">{message || "Please check your email for the verification link."}</p>
          {email && (
            <Button variant="outline" onClick={resend}>
              Resend Verification Email
            </Button>
          )}
        </>
      )}
    </div>
  )
}
