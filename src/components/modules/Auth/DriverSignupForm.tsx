"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { registerDriver } from "@/lib/actions/auth.actions"

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

    // Validate profile picture (mandatory for drivers)
    if (!profilePicture) {
      setProfilePicError("Profile picture is required")
      setLoading(false)
      return
    }

    const form = new FormData(e.currentTarget)
    // Override/add the profile picture file
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 gap-4">
        <ImageUpload
          name="profilePicture"
          required
          error={profilePicError}
          onFileChange={(file) => {
            setProfilePicture(file)
            if (file) setProfilePicError("")
          }}
        />

        <Input name="name" placeholder="Full Name" required />
        <Input name="email" type="email" placeholder="Email Address" required />
        <Input name="password" type="password" placeholder="Password" required minLength={6} />
        <Input name="phone" type="tel" placeholder="Phone Number" required />
        <Input name="address" placeholder="Address" required />

        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium text-primary mb-3">Vehicle Information</p>
          <div className="grid grid-cols-1 gap-4">
            <Input name="licenseNumber" placeholder="Driving License Number" required />
            <Input name="numberplate" placeholder="Vehicle Number Plate" required />
            <select
              name="vehicleType"
              className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="bike">Bike</option>
              <option value="car">Car</option>
            </select>
            <Input name="dob" type="date" placeholder="Date of Birth" required />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Driver Account"}
      </Button>
    </form>
  )
}
