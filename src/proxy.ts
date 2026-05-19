import { withAuth } from "next-auth/middleware"
import type { NextRequest } from "next/server"
import type { NextFetchEvent } from "next/server"

type AuthMiddleware = (req: NextRequest, event: NextFetchEvent) => ReturnType<ReturnType<typeof withAuth>>

const authProxy = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export function proxy(request: NextRequest) {
  return (authProxy as AuthMiddleware)(request, {} as NextFetchEvent)
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/create-ride",
    "/find-rides",
    "/rides/:path*",
    "/subscription/:path*",
  ],
}
