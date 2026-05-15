"use client"

import { useState, useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { forgotPassword } from "@/lib/actions/auth.actions"
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)

  const [formState, formAction, isPending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) => {
      const email = formData.get("email") as string
      const res = await forgotPassword(email)
      if (!res.success) return { error: res.message || "Request failed" }
      setSent(true)
      return { error: undefined }
    },
    { error: undefined }
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    formAction(form)
  }

  if (sent) {
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-border/40 bg-card p-8 sm:p-10 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 dark:bg-green-950/60 dark:border-green-800/60 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-xl font-bold text-primary mb-2">Check Your Email</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            We&apos;ve sent a password reset link to your email address. It may take a
            few minutes to arrive.
          </p>
          <Link href="/auth/login">
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    )
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
        <h1 className="text-2xl font-bold text-primary">Forgot Password</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          {formState.error && (
            <div className="p-3.5 rounded-xl text-sm flex items-start gap-2.5 bg-red-50 border border-red-200 dark:bg-red-950/60 dark:border-red-800/50 dark:text-red-300">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{formState.error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full h-11 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </div>
      <p className="text-sm text-center mt-6">
        <Link
          href="/auth/login"
          className="text-secondary hover:underline font-semibold inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </Link>
      </p>
    </div>
  )
}
