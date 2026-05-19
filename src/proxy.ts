import { withAuth } from "next-auth/middleware"
import type { NextRequest } from "next/server"

const authProxy = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export function proxy(request: NextRequest) {
  return (authProxy as any)(request)
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
