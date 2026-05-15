"use client"

import { useState, useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { SocialButtons } from "./SocialButtons"
import { registerRider } from "@/lib/actions/auth.actions"
import { Mail, Lock, User, Phone, MapPin, Loader2, AlertCircle } from "lucide-react"

export function RiderSignupForm() {
  const router = useRouter()
  const [profilePicture, setProfilePicture] = useState<File | null>(null)

  const [formState, formAction, isPending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) => {
      const res = await registerRider(formData)
      if (!res.success) return { error: res.message || "Registration failed" }
      router.push("/auth/verify?email=" + encodeURIComponent(formData.get("email") as string))
      return { error: undefined }
    },
    { error: undefined }
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    if (profilePicture) {
      form.set("profilePicture", profilePicture)
    } else {
      form.delete("profilePicture")
    }
    formAction(form)
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
