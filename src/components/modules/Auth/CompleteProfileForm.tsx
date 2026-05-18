"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfile } from "@/lib/actions/auth.actions"
import { Phone, MapPin, Loader2, User, Car, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { completeProfileSchema } from "@/schemas"

export function CompleteProfileForm() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
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

    const zodResult = completeProfileSchema.safeParse({ phone: data.phone, address: data.address })
    if (!zodResult.success) {
      const errors: Record<string, string> = {}
      for (const issue of zodResult.error.issues) {
        const path = issue.path[0] as string
        if (!errors[path]) errors[path] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    if (!data.subRole && !data.phone && !data.address) {
      router.push("/")
      router.refresh()
      return
    }

    setLoading(true)

    const res = await updateProfile(data, session?.user.accessToken || "", session?.user.id || "")
    if (!res.success) {
      setError(res.message || "Update failed")
      setLoading(false)
      return
    }
    await update()
    toast.success("Profile updated successfully!")
    router.push("/")
    router.refresh()
  }

  // Redirect away if profile is already complete
  useEffect(() => {
    if (session?.user.phone && session?.user.address) {
      router.replace("/")
    }
  }, [session?.user.phone, session?.user.address, router])

  function handleSkip() {
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <h1 className="text-xl md:text-2xl font-bold text-primary">Complete Your Profile</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Choose your role and add optional contact details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">I want to join as</label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                session?.user.subRole === "RIDER"
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/30 bg-card"
              }`}
            >
              <input type="radio" name="subRole" value="RIDER" className="sr-only" defaultChecked={session?.user.subRole === "RIDER"} />
              <User className={`w-6 h-6 ${session?.user.subRole === "RIDER" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-semibold">Rider</span>
              <span className="text-xs text-muted-foreground">I need rides</span>
            </label>
            <label
              className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                session?.user.subRole === "DRIVER"
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/30 bg-card"
              }`}
            >
              <input type="radio" name="subRole" value="DRIVER" className="sr-only" defaultChecked={session?.user.subRole === "DRIVER"} />
              <Car className={`w-6 h-6 ${session?.user.subRole === "DRIVER" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-semibold">Driver</span>
              <span className="text-xs text-muted-foreground">I give rides</span>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              name="phone"
              type="tel"
              placeholder="Phone Number (optional)"
              className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              name="address"
              placeholder="Your Address (optional)"
              className="pl-10 h-11 bg-muted/20 border-border/50 focus:border-secondary/50 rounded-xl transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl text-sm bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/60 dark:border-red-800/50 dark:text-red-300">
            {error}
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
              Saving...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Save & Continue
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        You can update these details later from your profile.
      </p>
      <button
        type="button"
        onClick={handleSkip}
        className="text-sm text-muted-foreground hover:text-secondary transition-colors text-center underline-offset-2 hover:underline"
      >
        Skip for now
      </button>
    </div>
  )
}
