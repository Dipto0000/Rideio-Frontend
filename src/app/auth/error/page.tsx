"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const errorMap: Record<string, string> = {
  CredentialsSignin: "Invalid email or password. Please try again.",
  OAuthAccountNotLinked: "This email is already linked to another sign-in method.",
  EmailVerification: "Please verify your email before signing in.",
  AccessDenied: "You don't have permission to access this page.",
  Configuration: "There is a problem with the server configuration.",
  Default: "An unexpected error occurred. Please try again.",
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const errorType = searchParams.get("error") || "Default"
  const errorMessage = errorMap[errorType] || errorMap.Default

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-md mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-primary">Authentication Error</h1>
      <p className="text-muted-foreground">{errorMessage}</p>
      <div className="flex gap-4">
        <Link href="/auth/login">
          <Button variant="primary">Try Again</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
