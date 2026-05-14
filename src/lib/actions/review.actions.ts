"use server"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export async function createReview(
  data: { rideId: string; rating: number; comment?: string },
  accessToken: string
) {
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(`${BACKEND}/api/v1/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  return json
}

export async function getRideReview(rideId: string, accessToken?: string) {
  const headers: Record<string, string> = {}
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  const res = await fetch(`${BACKEND}/api/v1/reviews/ride/${rideId}`, {
    headers,
  })
  const json = await res.json()
  return json
}

export async function getDriverReviews(driverId: string, accessToken: string, page = 1, limit = 5) {
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(
    `${BACKEND}/api/v1/reviews/driver/${driverId}?page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  const json = await res.json()
  return json
}
