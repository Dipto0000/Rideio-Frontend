const BACKEND = process.env.BACKEND_URL

export async function fetchWithAuth(
  path: string,
  accessToken: string,
  options: RequestInit = {}
) {
  if (!accessToken) {
    return { success: false, message: "Please sign in to continue." }
  }

  try {
    const res = await fetch(`${BACKEND}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    })

    const data = await res.json()

    if (!data.success && data.message) {
      const msg = data.message.toLowerCase()
      if (msg.includes("jwt") || msg.includes("token") || msg.includes("unauthorized")) {
        return { success: false, message: "Session expired. Please sign in again." }
      }
    }

    return data
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}
