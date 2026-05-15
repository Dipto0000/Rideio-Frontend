"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { registerDriver } from "@/lib/actions/auth.actions"
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Loader2,
  AlertCircle,
  Car,
  IdCard,
  Calendar,
} from "lucide-react"

export function DriverSignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePicError, setProfilePicError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setProfilePicError("")

    if (!profilePicture) {
      setProfilePicError("Profile picture is required")
      setLoading(false)
      return
    }

    const form = new FormData(e.currentTarget)
    form.set("profilePicture", profilePicture)

    const res = await registerDriver(form)
    if (!res.success) {
      setError(res.message || "Registration failed")
      setLoading(false)
      return
    }
    router.push("/auth/verify?email=" + encodeURIComponent(form.get("email") as string))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* Note explaining why Google signup is not available for drivers */}
      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs dark:bg-blue-950/60 dark:border-blue-800/60 dark:text-blue-200">
        Drivers must sign up with email and password. Google sign-up is not available for driver accounts.
      </div>

      <div className="flex justify-center">
        <ImageUpload
          name="profilePicture"
          required
          error={profilePicError}
          onFileChange={(file) => {
            setProfilePicture(file)
            if (file) setProfilePicError("")
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            name="name"
            placeholder="Full Name"
            required
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
          />
        </div>
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
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            name="password"
            type="password"
            placeholder="Password (min 6 characters)"
            required
            minLength={6}
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            required
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            name="address"
            placeholder="Address"
            required
            className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
          />
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="rounded-xl border border-border/30 bg-muted/10 p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Vehicle Information</p>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              name="licenseNumber"
              placeholder="Driving License Number"
              required
              className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
            />
          </div>
          <div className="relative">
            <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              name="numberplate"
              placeholder="Vehicle Number Plate"
              required
              className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
            />
          </div>
          <select
            name="vehicleType"
            className="flex h-11 w-full rounded-xl border border-border/50 bg-muted/20 px-3.5 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
            required
          >
            <option value="">Select Vehicle Type</option>
            <option value="bike">Bike</option>
            <option value="car">Car</option>
          </select>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              name="dob"
              type="date"
              placeholder="Date of Birth"
              required
              className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl text-sm flex items-start gap-2.5 bg-red-50 border border-red-200 dark:bg-red-950/60 dark:border-red-800/50 dark:text-red-300">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full h-11 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating account...
          </span>
        ) : (
          "Create Driver Account"
        )}
      </Button>
    </form>
  )
}
