const BACKEND = "/api/backend"

export interface RegisterRiderPayload {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
}

export interface RegisterDriverPayload {
  name: string
  email: string
  password: string
  phone: string
  address: string
  licenseNumber: string
  numberplate: string
  vehicleType: "bike" | "car"
  dob: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

export async function registerRider(payload: RegisterRiderPayload): Promise<ApiResponse> {
  const res = await fetch(`${BACKEND}/auth/register/rider`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function registerDriver(payload: RegisterDriverPayload): Promise<ApiResponse> {
  const res = await fetch(`${BACKEND}/auth/register/driver`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function verifyEmail(token: string): Promise<ApiResponse> {
  const res = await fetch(`${BACKEND}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  })
  return res.json()
}

export async function resendVerification(email: string): Promise<ApiResponse> {
  const res = await fetch(`${BACKEND}/auth/resend-confirmation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  return res.json()
}

export async function forgotPassword(email: string): Promise<ApiResponse> {
  const res = await fetch(`${BACKEND}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  return res.json()
}

export async function resetPassword(token: string, password: string): Promise<ApiResponse> {
  const res = await fetch(`${BACKEND}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  })
  return res.json()
}
