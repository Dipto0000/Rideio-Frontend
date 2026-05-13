"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfile } from "@/lib/actions/auth.actions"

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
    const data: {
      subRole?: "RIDER" | "DRIVER"
      phone?: string
      address?: string
    } = {}

    const role = form.get("subRole") as string
    if (role) data.subRole = role as "RIDER" | "DRIVER"
    const phone = form.get("phone") as string
    if (phone) data.phone = phone
    const address = form.get("address") as string
    if (address) data.address = address

    if (!data.subRole && !data.phone && !data.address) {
      router.push("/")
      router.refresh()
      return
    }

    const res = await updateProfile(data, session?.user.accessToken || "", session?.user.id || "")
    if (!res.success) {
      setError(res.message || "Update failed")
      setLoading(false)
      return
    }
    await update()
    router.push("/")
    router.refresh()
  }

  function handleSkip() {
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-primary">Complete Your Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose your role and add optional contact details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">I want to join as</label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex flex-col items-center gap-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                session?.user.subRole === "RIDER"
                  ? "border-secondary bg-secondary/5"
                  : "border-border hover:border-secondary/50"
              }`}
            >
              <input type="radio" name="subRole" value="RIDER" className="sr-only" defaultChecked={session?.user.subRole === "RIDER"} />
              <span className="text-2xl">🚗</span>
              <span className="text-sm font-medium">Rider</span>
              <span className="text-xs text-muted-foreground text-center">I need rides</span>
            </label>
            <label
              className={`flex flex-col items-center gap-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                session?.user.subRole === "DRIVER"
                  ? "border-secondary bg-secondary/5"
                  : "border-border hover:border-secondary/50"
              }`}
            >
              <input type="radio" name="subRole" value="DRIVER" className="sr-only" defaultChecked={session?.user.subRole === "DRIVER"} />
              <span className="text-2xl">🏍️</span>
              <span className="text-sm font-medium">Driver</span>
              <span className="text-xs text-muted-foreground text-center">I give rides</span>
            </label>
          </div>
        </div>

        <Input name="phone" type="tel" placeholder="Phone Number (optional)" />
        <Input name="address" placeholder="Your Address (optional)" />

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
