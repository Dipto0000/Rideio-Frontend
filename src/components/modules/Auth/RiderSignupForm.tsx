"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SocialButtons } from "./SocialButtons"

export function RiderSignupForm() {
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
      phone: (form.get("phone") as string) || undefined,
      address: (form.get("address") as string) || undefined,
    }

    try {
      const res = await fetch("/api/backend/auth/register/rider", {
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
      <SocialButtons role="RIDER" />

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or sign up with email</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input name="name" placeholder="Full Name" required />
        <Input name="email" type="email" placeholder="Email Address" required />
        <Input name="password" type="password" placeholder="Password" required minLength={6} />
        <Input name="phone" type="tel" placeholder="Phone Number (optional)" />
        <Input name="address" placeholder="Your Address (optional)" />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Rider Account"}
      </Button>
    </form>
  )
}
