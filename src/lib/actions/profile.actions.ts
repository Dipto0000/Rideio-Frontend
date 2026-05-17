"use server"

const BACKEND = process.env.BACKEND_URL

export async function getProfile(accessToken: string) {
  if (!accessToken) return { success: false, message: "Please sign in to view your profile." }
  try {
    const res = await fetch(`${BACKEND}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return await res.json()
  } catch {
    return { success: false, message: "Could not reach the server. Please check your internet connection and try again." }
  }
}

export async function updateProfile(
  data: {
    name?: string
    phone?: string
    address?: string
    vehicleType?: "bike" | "car"
    numberplate?: string
    licenseNumber?: string
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
    return { success: false, message: "Could not reach the server. Please check your internet connection and try again." }
  }
}

export async function uploadProfilePhoto(formData: FormData, accessToken: string) {
  if (!accessToken) return { success: false, message: "Please sign in to upload a photo." }

  try {
    const res = await fetch(`${BACKEND}/api/v1/users/me/photo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    })
    return await res.json()
  } catch {
    return { success: false, message: "Upload failed. Please check your internet connection and try again." }
  }
}

export async function changePassword(
  data: { currentPassword: string; newPassword: string },
  accessToken: string
) {
  if (!accessToken) return { success: false, message: "Please sign in to change your password." }

  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ oldPassword: data.currentPassword, newPassword: data.newPassword }),
    })
    return await res.json()
  } catch {
    return { success: false, message: "Could not reach the server. Please check your internet connection and try again." }
  }
}

export async function setPassword(
  data: { password: string },
  accessToken: string
) {
  if (!accessToken) return { success: false, message: "Please sign in to set a password." }

  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/set-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
    return await res.json()
  } catch {
    return { success: false, message: "Could not reach the server. Please check your internet connection and try again." }
  }
}
