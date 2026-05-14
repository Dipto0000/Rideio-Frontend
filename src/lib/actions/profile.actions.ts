"use server"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export async function getProfile(accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/user/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
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
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(`${BACKEND}/api/v1/user/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function uploadProfilePhoto(formData: FormData, accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(`${BACKEND}/api/v1/user/me/photo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  })
  return res.json()
}

export async function changePassword(
  data: { currentPassword: string; newPassword: string },
  accessToken: string
) {
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(`${BACKEND}/api/v1/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function setPassword(
  data: { password: string },
  accessToken: string
) {
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(`${BACKEND}/api/v1/auth/set-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}
