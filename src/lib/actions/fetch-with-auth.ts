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
      // Map technical backend errors to user-friendly messages
      if (msg.includes("casterror") || msg.includes("cast to") || msg.includes("invalid id")) {
        return { success: false, message: "The request could not be processed. Please check your input and try again." }
      }
      if (msg.includes("duplicate key") || msg.includes("e11000")) {
        return { success: false, message: "This item already exists. Please use a different value." }
      }
      if (msg.includes("validation failed") || msg.includes("validationerror")) {
        return { success: false, message: "Some of the information you provided is invalid. Please check and try again." }
      }
      // Pass through the original message if it's already user-friendly
      return { success: false, message: data.message }
    }

    return data
  } catch {
    return { success: false, message: "Unable to connect to the server. Please check your internet connection and try again." }
  }
}
