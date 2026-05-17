"use server"

import { fetchWithAuth } from "./fetch-with-auth"

const BACKEND = process.env.BACKEND_URL

export async function createReview(
  data: { rideId: string; rating: number; comment?: string },
  accessToken: string
) {
  return fetchWithAuth(`/api/v1/reviews`, accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getRideReview(rideId: string, accessToken?: string) {
  const headers: Record<string, string> = {}
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  try {
    const res = await fetch(`${BACKEND}/api/v1/reviews/ride/${rideId}`, { headers })
    return await res.json()
  } catch {
    return { success: false, message: "Could not load the review. Please check your internet connection." }
  }
}

export async function getDriverReviews(driverId: string, accessToken: string, page = 1, limit = 5) {
  return fetchWithAuth(
    `/api/v1/reviews/driver/${driverId}?page=${page}&limit=${limit}`,
    accessToken
  )
}
