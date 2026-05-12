"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CompleteProfileForm() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const payload = {
      phone: form.get("phone") as string,
      address: form.get("address") as string,
    }

    try {
      const res = await fetch(`/api/backend/user/${session?.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || "Update failed")
        return
      }
      await update()
      router.push("/")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSkip() {
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-primary">Complete Your Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add your phone number and address (optional)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input name="phone" type="tel" placeholder="Phone Number" />
        <Input name="address" placeholder="Your Address" />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save & Continue"}
        </Button>
      </form>

      <button
        type="button"
        onClick={handleSkip}
        className="text-sm text-muted-foreground hover:text-secondary text-center"
      >
        Skip for now
      </button>
    </div>
  )
}
