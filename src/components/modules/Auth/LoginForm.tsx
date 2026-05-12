"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SocialButtons } from "./SocialButtons"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const callbackUrl = searchParams.get("callbackUrl") || "/"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input name="email" type="email" placeholder="Email Address" required />
        <Input name="password" type="password" placeholder="Password" required />

        <div className="flex justify-end">
          <a
            href="/auth/forgot-password"
            className="text-sm text-secondary hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or continue with</span>
        </div>
      </div>

      <SocialButtons role="RIDER" />

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="/auth/role" className="text-secondary hover:underline font-medium">
          Sign up
        </a>
      </p>
    </div>
  )
}
