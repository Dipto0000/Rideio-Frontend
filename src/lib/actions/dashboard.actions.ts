"use server"

import { fetchWithAuth } from "./fetch-with-auth"

export async function getDriverDashboard(accessToken: string) {
  return fetchWithAuth(`/api/v1/dashboard/driver`, accessToken)
}

export async function getRiderDashboard(accessToken: string) {
  return fetchWithAuth(`/api/v1/dashboard/rider`, accessToken)
}

export async function getAdminDashboard(accessToken: string) {
  return fetchWithAuth(`/api/v1/dashboard/admin`, accessToken)
}
