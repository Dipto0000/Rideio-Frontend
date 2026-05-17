"use server"

import { fetchWithAuth } from "./fetch-with-auth"

export async function adminGetUsers(accessToken: string, query: Record<string, string> = {}) {
  const params = new URLSearchParams(query)
  return fetchWithAuth(`/api/v1/admin/users?${params}`, accessToken)
}

export async function adminGetRides(accessToken: string, query: Record<string, string> = {}) {
  const params = new URLSearchParams(query)
  return fetchWithAuth(`/api/v1/admin/rides?${params}`, accessToken)
}

export async function adminGetSubscriptions(accessToken: string, query: Record<string, string> = {}) {
  const params = new URLSearchParams(query)
  return fetchWithAuth(`/api/v1/admin/subscriptions?${params}`, accessToken)
}

export async function adminSoftDeleteUser(accessToken: string, userId: string, reason?: string) {
  return fetchWithAuth(`/api/v1/admin/users/${userId}/soft-delete`, accessToken, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  })
}

export async function adminSoftDeleteRide(accessToken: string, rideId: string, reason?: string) {
  return fetchWithAuth(`/api/v1/admin/rides/${rideId}/soft-delete`, accessToken, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  })
}

export async function adminUpdatePaymentStatus(accessToken: string, paymentId: string, status: string) {
  return fetchWithAuth(`/api/v1/admin/subscriptions/${paymentId}/status`, accessToken, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}

export async function adminCreateAdmin(accessToken: string, data: { name: string; email: string; password: string; phone?: string }) {
  return fetchWithAuth(`/api/v1/admin/super-admin/admins`, accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function adminRemoveAdmin(accessToken: string, adminId: string) {
  return fetchWithAuth(`/api/v1/admin/super-admin/admins/${adminId}`, accessToken, {
    method: "DELETE",
  })
}

export async function adminGetDeletedRecords(accessToken: string, query: Record<string, string> = {}) {
  const params = new URLSearchParams(query)
  return fetchWithAuth(`/api/v1/admin/deleted-records?${params}`, accessToken)
}
