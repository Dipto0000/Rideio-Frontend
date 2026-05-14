"use server"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export async function getDriverDashboard(accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/dashboard/driver`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function getRiderDashboard(accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/dashboard/rider`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function getAdminDashboard(accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/dashboard/admin`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}
