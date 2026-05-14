import type { Metadata } from "next"
import { Suspense } from "react"
import Image from "next/image"
import { LoginForm } from "@/components/modules/Auth/LoginForm"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Log In - Rideio",
}

export default function LoginPage() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 flex items-center justify-center p-8 md:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your Rideio account</p>
          </div>
          <Suspense
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>

      <div className="relative hidden lg:block h-full min-h-[calc(100vh-4rem)] order-1 lg:order-2">
        <Image
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80"
          alt="Motorcycle"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent" />
      </div>
    </div>
  )
}
