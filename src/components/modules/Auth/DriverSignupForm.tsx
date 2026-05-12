"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DriverSignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const payload = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      phone: form.get("phone") as string,
      address: form.get("address") as string,
      licenseNumber: form.get("licenseNumber") as string,
      numberplate: form.get("numberplate") as string,
      vehicleType: form.get("vehicleType") as string,
      dob: form.get("dob") as string,
    }

    try {
      const res = await fetch("/api/backend/auth/register/driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || "Registration failed")
        return
      }
      router.push("/auth/verify?email=" + encodeURIComponent(payload.email))
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 gap-4">
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
