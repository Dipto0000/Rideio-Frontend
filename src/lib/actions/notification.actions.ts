"use server"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export async function getNotifications(accessToken: string, page = 1, limit = 20) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(
      `${BACKEND}/api/v1/notifications?page=${page}&limit=${limit}&cacheBust=${Date.now()}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    )
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function getUnreadCount(accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(
      `${BACKEND}/api/v1/notifications/unread-count?cacheBust=${Date.now()}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    )
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function markAsRead(notificationId: string, accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(`${BACKEND}/api/v1/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.json()
}

export async function markAllAsRead(accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(`${BACKEND}/api/v1/notifications/read-all`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.json()
}

export async function getNotificationSettings(accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/notifications/settings`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function updateNotificationSettings(
  settings: Record<string, boolean>,
  accessToken: string
) {
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(`${BACKEND}/api/v1/notifications/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(settings),
  })
  return res.json()
}
