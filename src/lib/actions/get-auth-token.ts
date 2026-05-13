import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"

export async function getAuthToken() {
  const cookieStore = await cookies()
  const all = cookieStore.getAll()

  const tokenCookie =
    all.find((c) => c.name.includes("session-token")) ||
    all.find((c) => c.name.includes("next-auth"))

  if (!tokenCookie) return null

  try {
    const decoded = await decode({
      token: tokenCookie.value,
      secret: process.env.NEXTAUTH_SECRET!,
    })
    if (!decoded) return null

    if (!decoded.accessToken) return null

    return {
      id: decoded.id as string,
      accessToken: decoded.accessToken as string,
      refreshToken: decoded.refreshToken as string,
      subRole: decoded.subRole as "RIDER" | "DRIVER",
      role: decoded.role as "USER" | "ADMIN" | "SUPER_ADMIN",
    }
  } catch {
    return null
  }
}
