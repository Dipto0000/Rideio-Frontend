"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, Home } from "lucide-react"

const errorMap: Record<string, string> = {
  CredentialsSignin: "Invalid email or password. Please try again.",
  OAuthAccountNotLinked: "This email is already linked to another sign-in method.",
  EmailVerification: "Please verify your email before signing in.",
  AccessDenied: "You don\'t have permission to access this page.",
  Configuration: "There is a problem with the server configuration.",
  DriversMustUseCredentials: "Drivers must sign in with email and password. Google login is not available for driver accounts.",
  Default: "An unexpected error occurred. Please try again.",
}

export default function AuthErrorContent() {
  const searchParams = useSearchParams()
  const errorType = searchParams.get("error") || "Default"
  const errorMessage = errorMap[errorType] || errorMap.Default

  return (
    <div className="rounded-2xl border border-border/40 bg-card p-8 sm:p-10 shadow-sm text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50 flex items-center justify-center mx-auto mb-5">
        <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
      </div>
      <h1 className="text-xl font-bold text-primary mb-2">Authentication Error</h1>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
        {errorMessage}
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link href="/auth/login">
          <Button variant="primary" className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="rounded-xl">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
