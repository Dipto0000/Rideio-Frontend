"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { SocialButtons } from "./SocialButtons"
import { registerRider } from "@/lib/actions/auth.actions"

export function RiderSignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    // Override/add the profile picture file if selected
    if (profilePicture) {
      form.set("profilePicture", profilePicture)
    } else {
      form.delete("profilePicture")
    }

    const res = await registerRider(form)
    if (!res.success) {
      setError(res.message || "Registration failed")
      setLoading(false)
      return
    }
    router.push("/auth/verify?email=" + encodeURIComponent(form.get("email") as string))
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
        <ImageUpload
          name="profilePicture"
          onFileChange={(file) => setProfilePicture(file)}
        />

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
