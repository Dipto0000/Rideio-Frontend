"use client"

import { useState, useActionState, startTransition } from "react"
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
} from "lucide-react"
import { VehicleTypeSelector } from "@/components/ui/VehicleTypeSelector"
import { DOBPicker } from "@/components/ui/DOBPicker"
import { toast } from "sonner"
import { driverSignupSchema } from "@/schemas"

export function DriverSignupForm() {
  const router = useRouter()
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePicError, setProfilePicError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [vehicleType, setVehicleType] = useState<"car" | "bike" | "">("")
  const [dob, setDob] = useState("")

  const [formState, formAction, isPending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) => {
      const res = await registerDriver(formData)
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
    setProfilePicError("")

    const form = new FormData(e.currentTarget)
    const data = {
      name: (form.get("name") as string) || "",
      email: (form.get("email") as string) || "",
      password: (form.get("password") as string) || "",
      phone: (form.get("phone") as string) || "",
      address: (form.get("address") as string) || "",
      licenseNumber: (form.get("licenseNumber") as string) || "",
      numberplate: (form.get("numberplate") as string) || "",
      vehicleType,
      dob,
    }

    const result = driverSignupSchema.safeParse(data)
    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const path = issue.path[0] as string
        if (!errors[path]) errors[path] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    if (!profilePicture) {
      setProfilePicError("Profile picture is required")
      return
    }

    form.set("profilePicture", profilePicture)
    form.set("vehicleType", vehicleType)
    form.set("dob", dob)
    startTransition(() => {
      formAction(form)
    })
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
            placeholder="01712345678"
            required
            pattern="(?:\+8801|01)[3-9]\d{8}"
            className={`pl-10 h-11 bg-muted/20 rounded-xl transition-all ${
              fieldErrors.phone ? "border-destructive focus:border-destructive" : "border-border/50 focus:border-secondary/50"
            }`}
            onChange={() => setFieldErrors((prev) => ({ ...prev, phone: "" }))}
          />
          {fieldErrors.phone && <p className="text-xs text-destructive mt-1 ml-1">{fieldErrors.phone}</p>}
        </div>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            name="address"
            placeholder="Address"
            required
            className={`pl-10 h-11 bg-muted/20 rounded-xl transition-all ${
              fieldErrors.address ? "border-destructive focus:border-destructive" : "border-border/50 focus:border-secondary/50"
            }`}
            onChange={() => setFieldErrors((prev) => ({ ...prev, address: "" }))}
          />
          {fieldErrors.address && <p className="text-xs text-destructive mt-1 ml-1">{fieldErrors.address}</p>}
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
              className={`pl-10 h-11 bg-muted/20 rounded-xl transition-all ${
                fieldErrors.licenseNumber ? "border-destructive focus:border-destructive" : "border-border/50 focus:border-secondary/50"
              }`}
              onChange={() => setFieldErrors((prev) => ({ ...prev, licenseNumber: "" }))}
            />
            {fieldErrors.licenseNumber && <p className="text-xs text-destructive mt-1 ml-1">{fieldErrors.licenseNumber}</p>}
          </div>
          <div className="relative">
            <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              name="numberplate"
              placeholder="Vehicle Number Plate"
              required
              className={`pl-10 h-11 bg-muted/20 rounded-xl transition-all ${
                fieldErrors.numberplate ? "border-destructive focus:border-destructive" : "border-border/50 focus:border-secondary/50"
              }`}
              onChange={() => setFieldErrors((prev) => ({ ...prev, numberplate: "" }))}
            />
            {fieldErrors.numberplate && <p className="text-xs text-destructive mt-1 ml-1">{fieldErrors.numberplate}</p>}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 ml-1">Vehicle Type</p>
            <VehicleTypeSelector
              value={vehicleType}
              onChange={(val) => {
                setVehicleType(val)
                setFieldErrors((prev) => ({ ...prev, vehicleType: "" }))
              }}
            />
          </div>
          {fieldErrors.vehicleType && <p className="text-xs text-destructive mt-1 ml-1">{fieldErrors.vehicleType}</p>}
          <div>
            <p className="text-xs text-muted-foreground mb-2 ml-1">Date of Birth</p>
            <DOBPicker
              value={dob}
              onChange={(val) => {
                setDob(val)
                setFieldErrors((prev) => ({ ...prev, dob: "" }))
              }}
            />
          </div>
          {fieldErrors.dob && <p className="text-xs text-destructive mt-1 ml-1">{fieldErrors.dob}</p>}
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
          "Create Driver Account"
        )}
      </Button>
    </form>
  )
}
