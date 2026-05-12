"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status, update } = useSession()

  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"
  const isRider = session?.user.subRole === "RIDER"
  const isDriver = session?.user.subRole === "DRIVER"
  const isAdmin = session?.user.role === "ADMIN" || session?.user.role === "SUPER_ADMIN"
  const isSubscribed = session?.user.isSubscribed ?? false

  async function login(email: string, password: string, callbackUrl?: string) {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    if (result?.ok && callbackUrl) {
      window.location.href = callbackUrl
    }
    return result
  }

  async function loginWithGoogle(callbackUrl?: string) {
    await signIn("google", { callbackUrl: callbackUrl || "/auth/complete-profile" })
  }

  async function logout() {
    await signOut({ redirect: false })
    window.location.href = "/"
  }

  return {
    session,
    status,
    isLoading,
    isAuthenticated,
    isRider,
    isDriver,
    isAdmin,
    isSubscribed,
    user: session?.user,
    login,
    loginWithGoogle,
    logout,
    update,
  }
}
