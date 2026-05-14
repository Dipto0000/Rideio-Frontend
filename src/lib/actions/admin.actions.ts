"use server"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export async function adminGetUsers(accessToken: string, query: Record<string, string> = {}) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const params = new URLSearchParams(query)
    const res = await fetch(`${BACKEND}/api/v1/admin/users?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function adminGetRides(accessToken: string, query: Record<string, string> = {}) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const params = new URLSearchParams(query)
    const res = await fetch(`${BACKEND}/api/v1/admin/rides?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function adminGetSubscriptions(accessToken: string, query: Record<string, string> = {}) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const params = new URLSearchParams(query)
    const res = await fetch(`${BACKEND}/api/v1/admin/subscriptions?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function adminSoftDeleteUser(accessToken: string, userId: string, reason?: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ reason }),
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function adminSoftDeleteRide(accessToken: string, rideId: string, reason?: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/admin/rides/${rideId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ reason }),
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function adminUpdatePaymentStatus(accessToken: string, paymentId: string, status: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/admin/subscriptions/${paymentId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function adminCreateAdmin(accessToken: string, data: { name: string; email: string; password: string; phone?: string }) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/admin/super-admin/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function adminRemoveAdmin(accessToken: string, adminId: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/admin/super-admin/admins/${adminId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function adminGetDeletedRecords(accessToken: string, query: Record<string, string> = {}) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const params = new URLSearchParams(query)
    const res = await fetch(`${BACKEND}/api/v1/admin/deleted-records?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}
