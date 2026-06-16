"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Eye, Car, User, Shield, Users, Loader2 } from "lucide-react"
import { toast } from "sonner"

const DEMO_ROLES = [
  {
    role: "RIDER",
    label: "Browse as Rider",
    subtitle: "Explore the app",
    icon: User,
    color: "bg-primary/10 text-primary hover:bg-primary/15",
  },
  {
    role: "DRIVER",
    label: "Browse as Driver",
    subtitle: "Driver dashboard",
    icon: Car,
    color: "bg-secondary/10 text-secondary hover:bg-secondary/15",
  },
  {
    role: "ADMIN",
    label: "Browse as Admin",
    subtitle: "Manage platform",
    icon: Shield,
    color: "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/15 dark:text-indigo-400",
  },
  {
    role: "SUPER_ADMIN",
    label: "Browse as Super Admin",
    subtitle: "Full access",
    icon: Users,
    color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 dark:text-amber-400",
  },
]

const ROLE_LABELS: Record<string, string> = {
  RIDER: "Rider",
  DRIVER: "Driver",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
}

export function DemoLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loadingRole, setLoadingRole] = useState<string | null>(null)

  const rawCallbackUrl = searchParams.get("callbackUrl") || "/"

  let callbackUrl = rawCallbackUrl
  try {
    callbackUrl = new URL(rawCallbackUrl).pathname || "/"
  } catch {
    // Already a relative path
  }

  async function handleDemoLogin(role: string) {
    setLoadingRole(role)
    try {
      const res = await fetch("/api/backend/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })

      const data = await res.json()

      if (!data.success) {
        toast.error(data.message || "Demo login failed")
        return
      }

      // Sign in using the token provider with the demo tokens
      const result = await signIn("token", {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Demo login failed. Please try again.")
        return
      }

      // For admin/super admin, redirect to the admin dashboard
      const redirectTo =
        role === "ADMIN" || role === "SUPER_ADMIN"
          ? "/dashboard/admin/users"
          : role === "DRIVER"
            ? "/dashboard"
            : callbackUrl || "/"

      toast.success(`Browsing as ${ROLE_LABELS[role]} (Demo)`)
      router.push(redirectTo)
      router.refresh()
    } catch {
      toast.error("Unable to connect to the server. Please try again.")
    } finally {
      setLoadingRole(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2.5">
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 shrink-0">
          <Eye className="w-3.5 h-3.5" />
          Demo Access
        </span>
        <div className="h-px flex-1 bg-border/60" />
      </div>

      <p className="text-xs text-center text-muted-foreground -mt-1">
        Instantly explore all features without signing up
      </p>

      <div className="grid grid-cols-2 gap-3">
        {DEMO_ROLES.map(({ role, label, subtitle, icon: Icon, color }) => (
          <Button
            key={role}
            type="button"
            variant="outline"
            disabled={loadingRole !== null}
            onClick={() => handleDemoLogin(role)}
            className={`flex flex-col items-center gap-1 py-3 px-3 h-auto rounded-xl border-border/50 transition-all duration-200 hover:border-secondary/30 ${color}`}
          >
            {loadingRole === role ? (
              <Loader2 className="w-5 h-5 animate-spin shrink-0" />
            ) : (
              <Icon className="w-5 h-5 shrink-0" />
            )}
            <span className="text-xs font-semibold leading-tight text-center">{label}</span>
            <span className="text-[10px] text-muted-foreground text-center truncate max-w-full">
              {subtitle}
            </span>
          </Button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground font-medium">
            or sign in normally
          </span>
        </div>
      </div>
    </div>
  )
}
