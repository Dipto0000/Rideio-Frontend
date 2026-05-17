"use server"

import { fetchWithAuth } from "./fetch-with-auth"

export async function getNotifications(accessToken: string, page = 1, limit = 20) {
  return fetchWithAuth(
    `/api/v1/notifications?page=${page}&limit=${limit}&cacheBust=${Date.now()}`,
    accessToken
  )
}

export async function getUnreadCount(accessToken: string) {
  return fetchWithAuth(
    `/api/v1/notifications/unread-count?cacheBust=${Date.now()}`,
    accessToken
  )
}

export async function markAsRead(notificationId: string, accessToken: string) {
  return fetchWithAuth(`/api/v1/notifications/${notificationId}/read`, accessToken, {
    method: "PATCH",
  })
}

export async function markAllAsRead(accessToken: string) {
  return fetchWithAuth(`/api/v1/notifications/read-all`, accessToken, {
    method: "PATCH",
  })
}

export async function getNotificationSettings(accessToken: string) {
  return fetchWithAuth(`/api/v1/notifications/settings`, accessToken)
}

export async function updateNotificationSettings(
  settings: Record<string, boolean>,
  accessToken: string
) {
  return fetchWithAuth(`/api/v1/notifications/settings`, accessToken, {
    method: "PATCH",
    body: JSON.stringify(settings),
  })
}
