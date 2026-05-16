"use server"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

async function handleResponse(res: Response) {
  const data = await res.json()
  if (!data.success && data.message) {
    const msg = data.message.toLowerCase()
    if (msg.includes("jwt") || msg.includes("token") || msg.includes("unauthorized")) {
      return { success: false, message: "Session expired. Please sign in again." }
    }
  }
  return data
}

export async function createRide(
  data: {
    from: { address: string; lat: number; lng: number }
    to: { address: string; lat: number; lng: number }
    arrivalTime: string
    vehicleType: "BIKE" | "CAR"
  },
  accessToken: string
) {
  if (!accessToken) return { success: false, message: "Please sign in to create a ride." }

  const res = await fetch(`${BACKEND}/api/v1/rides`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function acceptRide(rideId: string, accessToken: string) {
  if (!accessToken) return { success: false, message: "Please sign in to accept rides." }

  const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/accept`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return handleResponse(res)
}

export async function cancelRide(rideId: string, accessToken: string) {
  if (!accessToken) return { success: false, message: "Please sign in to cancel rides." }

  const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/cancel`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return handleResponse(res)
}

export async function startRide(rideId: string, accessToken: string) {
  if (!accessToken) return { success: false, message: "Please sign in to start rides." }

  const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/start`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return handleResponse(res)
}

export async function completeRide(rideId: string, accessToken: string) {
  if (!accessToken) return { success: false, message: "Please sign in to complete rides." }

  const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/complete`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return handleResponse(res)
}

export async function getRideById(rideId: string, accessToken?: string) {
  const res = await fetch(
    `${BACKEND}/api/v1/rides/${rideId}`,
    {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    }
  )
  return res.json()
}

export async function getMyRides(accessToken: string, page = 1, limit = 10) {
  if (!accessToken) return { success: false, message: "Please sign in to view your rides." }

  const res = await fetch(
    `${BACKEND}/api/v1/rides/my-rides?page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  return handleResponse(res)
}
