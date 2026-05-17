"use server"

const BACKEND = process.env.BACKEND_URL

export async function registerRider(formData: FormData) {
  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/register/rider`, {
      method: "POST",
      body: formData,
    })
    return await res.json()
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function registerDriver(formData: FormData) {
  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/register/driver`, {
      method: "POST",
      body: formData,
    })
    return await res.json()
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function forgotPassword(email: string) {
  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    return await res.json()
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    })
    return await res.json()
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function verifyEmail(token: string) {
  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
    return await res.json()
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function resendVerification(email: string) {
  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/resend-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    return await res.json()
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function updateProfile(
  data: {
    subRole?: "RIDER" | "DRIVER"
    phone?: string
    address?: string
  },
  accessToken: string,
  userId: string
) {
  if (!accessToken) return { success: false, message: "Please sign in to update your profile." }

  try {
    const res = await fetch(`${BACKEND}/api/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
    return await res.json()
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}
