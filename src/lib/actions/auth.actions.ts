"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export async function registerRider(data: {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
}) {
  const res = await fetch(`${BACKEND}/api/v1/auth/register/rider`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function registerDriver(data: {
  name: string
  email: string
  password: string
  phone: string
  address: string
  licenseNumber: string
  numberplate: string
  vehicleType: string
  dob: string
}) {
  const res = await fetch(`${BACKEND}/api/v1/auth/register/driver`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${BACKEND}/api/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  return res.json()
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch(`${BACKEND}/api/v1/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  })
  return res.json()
}

export async function verifyEmail(token: string) {
  const res = await fetch(`${BACKEND}/api/v1/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  })
  return res.json()
}

export async function resendVerification(email: string) {
  const res = await fetch(`${BACKEND}/api/v1/auth/resend-confirmation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  return res.json()
}

export async function updateProfile(data: {
  subRole?: "RIDER" | "DRIVER"
  phone?: string
  address?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.accessToken) {
    return { success: false, message: "Unauthorized" }
  }

  const res = await fetch(`${BACKEND}/api/v1/user/${session.user.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}
