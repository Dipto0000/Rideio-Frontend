import type { Metadata } from "next"
import Link from "next/link"
import { RiderSignupForm } from "@/components/modules/Auth/RiderSignupForm"
import { DriverSignupForm } from "@/components/modules/Auth/DriverSignupForm"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a Rideio account to start riding or driving across Bangladesh.",
}

export default async function SignupPage(props: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role } = await props.searchParams
  const isDriver = role === "driver"

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="text-2xl font-bold text-primary tracking-tight inline-block mb-6"
        >
          Rideio
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          {isDriver ? "Become a Driver" : "Join as a Rider"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          {isDriver
            ? "Start earning by giving rides. Fill in your details below."
            : "Create an account to start your ride journey."}
        </p>
      </div>
      <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8 shadow-sm">
        {isDriver ? <DriverSignupForm /> : <RiderSignupForm />}
      </div>
      <p className="text-sm text-center text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-secondary hover:underline font-semibold"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}
