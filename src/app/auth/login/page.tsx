import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/components/modules/Auth/LoginForm"
import { DemoLoginForm } from "@/components/modules/Auth/DemoLoginForm"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Log In",
  description: "Sign in to your Rideio account to find rides or manage your driving.",
}

export default function LoginPage() {
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="text-2xl font-bold text-primary tracking-tight inline-block mb-6"
        >
          Rideio
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Welcome Back</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Sign in to your Rideio account to continue
        </p>
      </div>

      {/* Demo Access Section — Above the regular login */}
      <div className="rounded-2xl border-2 border-dashed border-secondary/30 bg-secondary/[0.03] p-6 sm:p-8 shadow-sm mb-6">
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          }
        >
          <DemoLoginForm />
        </Suspense>
      </div>

      {/* Regular Login */}
      <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8 shadow-sm">
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
      <p className="text-sm text-center text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/role"
          className="text-secondary hover:underline font-semibold"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
