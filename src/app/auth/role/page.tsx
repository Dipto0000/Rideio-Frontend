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
    <div className="flex flex-col items-center w-full">
      <RoleSelector />

      {/* Demo Access */}
      <div className="w-full mt-10 rounded-2xl border-2 border-dashed border-secondary/30 bg-secondary/[0.03] p-6 sm:p-8 shadow-sm">
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
  )
}
