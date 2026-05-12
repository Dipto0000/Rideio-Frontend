import type { Metadata } from "next"
import Image from "next/image"
import { RiderSignupForm } from "@/components/modules/Auth/RiderSignupForm"
import { DriverSignupForm } from "@/components/modules/Auth/DriverSignupForm"

export const metadata: Metadata = {
  title: "Sign Up - Rideio",
}

export default async function SignupPage(props: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role } = await props.searchParams
  const isDriver = role === "driver"

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-3">
      <div className="relative hidden lg:block h-full min-h-[calc(100vh-4rem)]">
        <Image
          src={
            isDriver
              ? "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80"
              : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
          }
          alt={isDriver ? "Motorcycle" : "Classic Car"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      <div className="lg:col-span-2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">
              {isDriver ? "Become a Driver" : "Join as a Rider"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isDriver
                ? "Start earning by giving rides. Fill in your details below."
                : "Create an account to start your ride journey."}
            </p>
          </div>
          {isDriver ? <DriverSignupForm /> : <RiderSignupForm />}
          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <a href="/auth/login" className="text-secondary hover:underline font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
