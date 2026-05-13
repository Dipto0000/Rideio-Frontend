"use server"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export async function initiatePayment(accessToken: string, planType: "MONTHLY" = "MONTHLY") {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/subscription/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ planType }),
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function getSubscriptionStatus(accessToken: string) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(`${BACKEND}/api/v1/subscription/status`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}

export async function getPaymentHistory(accessToken: string, page = 1) {
  if (!accessToken) return { success: false, message: "Unauthorized" }
  try {
    const res = await fetch(
      `${BACKEND}/api/v1/subscription/history?page=${page}&limit=10`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return res.json()
  } catch {
    return { success: false, message: "Backend unreachable" }
  }
}
