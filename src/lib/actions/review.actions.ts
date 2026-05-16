"use server"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export async function createReview(
  data: { rideId: string; rating: number; comment?: string },
  accessToken: string
) {
  if (!accessToken) return { success: false, message: "Please sign in to leave a review." }

  try {
    const res = await fetch(`${BACKEND}/api/v1/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
    return await res.json()
  } catch {
    return { success: false, message: "Could not submit your review. Please check your internet connection and try again." }
  }
}

export async function getRideReview(rideId: string, accessToken?: string) {
  const headers: Record<string, string> = {}
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  try {
    const res = await fetch(`${BACKEND}/api/v1/reviews/ride/${rideId}`, {
      headers,
    })
    return await res.json()
  } catch {
    return { success: false, message: "Could not load the review. Please check your internet connection." }
  }
}

export async function getDriverReviews(driverId: string, accessToken: string, page = 1, limit = 5) {
  if (!accessToken) return { success: false, message: "Please sign in to view reviews." }

  try {
    const res = await fetch(
      `${BACKEND}/api/v1/reviews/driver/${driverId}?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return await res.json()
  } catch {
    return { success: false, message: "Could not load reviews. Please check your internet connection." }
  }
}
