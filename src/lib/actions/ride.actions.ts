"use server"

const BACKEND = process.env.BACKEND_URL

async function handleResponse(res: Response) {
  try {
    const data = await res.json()
    if (!data.success && data.message) {
      const msg = data.message.toLowerCase()
      if (msg.includes("jwt") || msg.includes("token") || msg.includes("unauthorized")) {
        return { success: false, message: "Session expired. Please sign in again." }
      }
      if (msg.includes("casterror") || msg.includes("cast to") || msg.includes("invalid id")) {
        return { success: false, message: "The request could not be processed. Please check your input and try again." }
      }
      if (msg.includes("duplicate key") || msg.includes("e11000")) {
        return { success: false, message: "This item already exists. Please use a different value." }
      }
      if (msg.includes("validation failed") || msg.includes("validationerror")) {
        return { success: false, message: "Some of the information you provided is invalid. Please check and try again." }
      }
    }
    return data
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function createRide(
  data: {
    from: { address: string; lat: number; lng: number }
    to: { address: string; lat: number; lng: number }
    arrivalTime: string
    vehicleType: "BIKE" | "CAR"
    phone?: string
  },
  accessToken: string
) {
  if (!accessToken) return { success: false, message: "Please sign in to create a ride." }

  try {
    const res = await fetch(`${BACKEND}/api/v1/rides`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function acceptRide(rideId: string, accessToken: string) {
  if (!accessToken) return { success: false, message: "Please sign in to accept rides." }

  try {
    const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/accept`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return handleResponse(res)
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function cancelRide(rideId: string, accessToken: string) {
  if (!accessToken) return { success: false, message: "Please sign in to cancel rides." }

  try {
    const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return handleResponse(res)
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function startRide(rideId: string, accessToken: string) {
  if (!accessToken) return { success: false, message: "Please sign in to start rides." }

  try {
    const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/start`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return handleResponse(res)
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function completeRide(rideId: string, accessToken: string) {
  if (!accessToken) return { success: false, message: "Please sign in to complete rides." }

  try {
    const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/complete`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return handleResponse(res)
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function getMyRides(accessToken: string, page = 1, limit = 50) {
  try {
    const res = await fetch(
      `${BACKEND}/api/v1/rides/my-rides?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return handleResponse(res)
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}

export async function getRideById(rideId: string, accessToken?: string) {
  try {
    const res = await fetch(
      `${BACKEND}/api/v1/rides/${rideId}`,
      {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      }
    )
    return await res.json()
  } catch {
    return { success: false, message: "Could not load ride details. Please check your internet connection." }
  }
}
