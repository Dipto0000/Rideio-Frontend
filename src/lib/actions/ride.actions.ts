"use server"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export async function createRide(
  data: {
    from: { address: string; lat: number; lng: number }
    to: { address: string; lat: number; lng: number }
    arrivalTime: string
    vehicleType: "BIKE" | "CAR"
  },
  accessToken: string
) {
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(`${BACKEND}/api/v1/rides`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function acceptRide(rideId: string, accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/accept`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.json()
}

export async function cancelRide(rideId: string, accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/cancel`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.json()
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
  if (!accessToken) return { success: false, message: "Unauthorized" }

  const res = await fetch(
    `${BACKEND}/api/v1/rides/my-rides?page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  return res.json()
}
