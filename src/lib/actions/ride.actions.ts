"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export async function createRide(data: {
  from: { address: string; lat: number; lng: number }
  to: { address: string; lat: number; lng: number }
  arrivalTime: string
  vehicleType: "BIKE" | "CAR"
  proposedFare: number
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.accessToken) {
    return { success: false, message: "Unauthorized" }
  }

  const res = await fetch(`${BACKEND}/api/v1/rides`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function acceptRide(rideId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.accessToken) {
    return { success: false, message: "Unauthorized" }
  }

  const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/accept`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  })
  return res.json()
}

export async function cancelRide(rideId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.accessToken) {
    return { success: false, message: "Unauthorized" }
  }

  const res = await fetch(`${BACKEND}/api/v1/rides/${rideId}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  })
  return res.json()
}

export async function getMyRides(page = 1, limit = 10) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.accessToken) {
    return { success: false, message: "Unauthorized" }
  }

  const res = await fetch(
    `${BACKEND}/api/v1/rides/my-rides?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    }
  )
  return res.json()
}
