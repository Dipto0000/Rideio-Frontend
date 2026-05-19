"use client"

import { useState, useActionState, startTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { SocialButtons } from "./SocialButtons"
import { registerRider } from "@/lib/actions/auth.actions"
import { Mail, Lock, User, Phone, MapPin, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { riderSignupSchema } from "@/schemas"

export function RiderSignupForm() {
  const router = useRouter()
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [formState, formAction, isPending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) => {
      const res = await registerRider(formData)
      if (!res.success) return { error: res.message || "Registration failed" }
      const email = formData.get("email") as string
      toast.success("Account created! Please verify your email.")
      router.push("/auth/verify?email=" + encodeURIComponent(email))
      return { error: undefined }
    },
    { error: undefined }
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})

    const form = new FormData(e.currentTarget)
    const data = {
      name: (form.get("name") as string) || "",
      email: (form.get("email") as string) || "",
      password: (form.get("password") as string) || "",
      phone: (form.get("phone") as string) || undefined,
      address: (form.get("address") as string) || undefined,
    }

    const result = riderSignupSchema.safeParse(data)
    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const path = issue.path[0] as string
        if (!errors[path]) errors[path] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    if (profilePicture) {
      form.set("profilePicture", profilePicture)
    } else {
      form.delete("profilePicture")
    }
    startTransition(() => {
      formAction(form)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <SocialButtons role="RIDER" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground font-medium">
            or sign up with email
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <ImageUpload
          name="profilePicture"
          onFileChange={(file) => setProfilePicture(file)}
        />
      </div>

      <div className="space-y-3">
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            name="name"
            placeholder="Full Name"
            required
            className={`pl-10 h-11 bg-muted/20 rounded-xl transition-all ${
              fieldErrors.name ? "border-destructive focus:border-destructive" : "border-border/50 focus:border-secondary/50"
            }`}
            onChange={() => setFieldErrors((prev) => ({ ...prev, name: "" }))}
          />
          {fieldErrors.name && <p className="text-xs text-destructive mt-1 ml-1">{fieldErrors.name}</p>}
        </div>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            className={`pl-10 h-11 bg-muted/20 rounded-xl transition-all ${
              fieldErrors.email ? "border-destructive focus:border-destructive" : "border-border/50 focus:border-secondary/50"
            }`}
            onChange={() => setFieldErrors((prev) => ({ ...prev, email: "" }))}
          />
          {fieldErrors.email && <p className="text-xs text-destructive mt-1 ml-1">{fieldErrors.email}</p>}
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            name="password"
            type="password"
            placeholder="Min 6 chars, 1 letter, 1 special character"
            required
            minLength={6}
            className={`pl-10 h-11 bg-muted/20 rounded-xl transition-all ${
              fieldErrors.password ? "border-destructive focus:border-destructive" : "border-border/50 focus:border-secondary/50"
            }`}
            onChange={() => setFieldErrors((prev) => ({ ...prev, password: "" }))}
          />
          {fieldErrors.password && <p className="text-xs text-destructive mt-1 ml-1">{fieldErrors.password}</p>}
        </div>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            name="phone"
            type="tel"
            placeholder="01712345678 (optional)"
            pattern="(?:\+8801|01)[3-9]\d{8}"
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

      {formState.error && (
        <div className="p-3.5 rounded-xl text-sm flex items-start gap-2.5 bg-red-50 border border-red-200 dark:bg-red-950/60 dark:border-red-800/50 dark:text-red-300">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{formState.error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full h-11 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating account...
          </span>
        ) : (
          "Create Rider Account"
        )}
      </Button>
    </form>
  )
}
