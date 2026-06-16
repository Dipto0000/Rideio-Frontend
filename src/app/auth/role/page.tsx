import type { Metadata } from "next"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { RoleSelector } from "@/components/modules/Auth/RoleSelector"
import { DemoLoginForm } from "@/components/modules/Auth/DemoLoginForm"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Choose Your Role",
  description: "Sign up as a rider or driver on Rideio.",
}

export default function RolePage() {
  return (
    <>
      {/* Shared heading — above both columns */}
      <div className="md:w-screen md:relative md:left-1/2 md:-mx-[50vw]">
        <div className="md:max-w-4xl md:mx-auto md:px-4">
          <div className="text-center mb-6 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Join Rideio
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Choose how you want to use Rideio
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-side: Role Cards + Demo */}
      <div className="md:w-screen md:relative md:left-1/2 md:-mx-[50vw]">
        <div className="md:max-w-4xl md:mx-auto md:px-4">
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
            {/* Left: Role Cards */}
            <div className="w-full md:flex-1 min-w-0">
              <RoleSelector hideHeading />
            </div>

            {/* Right: Demo Access */}
            <div className="w-full md:w-[340px] md:shrink-0">
              <div className="rounded-2xl border-2 border-dashed border-secondary/30 bg-secondary/[0.03] p-6 sm:p-8 shadow-sm">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Want to explore Rideio without signing up?
                  </p>
                </div>
                <Suspense
                  fallback={
                    <div className="grid grid-cols-2 gap-3">
                      <Skeleton className="h-16 w-full rounded-xl" />
                      <Skeleton className="h-16 w-full rounded-xl" />
                      <Skeleton className="h-16 w-full rounded-xl" />
                      <Skeleton className="h-16 w-full rounded-xl" />
                    </div>
                  }
                >
                  <DemoLoginForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
