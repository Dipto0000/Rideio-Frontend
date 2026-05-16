import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

/** Decode JWT payload to get expiry (no verification needed) */
function getJwtExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1]
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString())
    return decoded.exp ? decoded.exp * 1000 : null // seconds → ms
  } catch {
    return null
  }
}

/** Call backend to exchange a refresh token for a new access token */
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
    const data = await res.json()
    if (!data.success) return null
    return data.data.accessToken ?? null
  } catch {
    return null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "token",
      name: "token",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken) return null
        try {
          const res = await fetch(`${BACKEND}/api/v1/user/me`, {
            headers: { Authorization: `Bearer ${credentials.accessToken}` },
          })
          const data = await res.json()
          if (!res.ok || !data.success) return null
          const u = data.data
          return {
            id: u._id || u.id,
            email: u.email,
            name: u.name,
            image: u.picture,
            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken,
            role: u.role,
            subRole: u.subRole,
            phone: u.phone,
            address: u.address,
            isVerified: u.isVerified,
            isSubscribed: u.subscription?.isSubscribed ?? false,
          }
        } catch {
          return null
        }
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const res = await fetch(`${BACKEND}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await res.json()
          if (!res.ok || !data.success) return null

          const u = data.data.user
          return {
            id: u._id || u.id,
            email: u.email,
            name: u.name,
            image: u.picture,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            role: u.role,
            subRole: u.subRole,
            phone: u.phone,
            address: u.address,
            isVerified: u.isVerified,
            isSubscribed: u.subscription?.isSubscribed ?? false,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${BACKEND}/api/v1/auth/google-auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile?.email,
              name: profile?.name,
              picture: (profile as any)?.picture || (profile as any)?.image,
              googleId: account.providerAccountId,
            }),
          })
          const data = await res.json()
          if (!data.success) {
            return `/auth/login?error=${encodeURIComponent(data.message || "Google sign-in failed")}`
          }
          return true
        } catch {
          return `/auth/login?error=${encodeURIComponent("Could not connect to the server. Please try again.")}`
        }
      }
      return true
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        if (account?.provider === "google") {
          try {
            const res = await fetch(`${BACKEND}/api/v1/auth/google-auth`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                picture: user.image,
                googleId: account.providerAccountId,
              }),
            })
            const data = await res.json()
            if (data.success) {
              const u = data.data.user
              token.id = u._id || u.id
              token.accessToken = data.data.accessToken
              token.refreshToken = data.data.refreshToken
              token.accessTokenExpires = getJwtExpiry(data.data.accessToken) ?? 0
              token.role = u.role
              token.subRole = u.subRole
              token.phone = u.phone
              token.address = u.address
              token.isVerified = u.isVerified
              token.isSubscribed = u.subscription?.isSubscribed ?? false
              token.picture = u.picture
            }
          } catch {
            /* backend unreachable */
          }
        } else {
          token.id = user.id
          token.accessToken = user.accessToken
          token.refreshToken = user.refreshToken
          token.accessTokenExpires = getJwtExpiry(user.accessToken) ?? 0
          token.role = user.role
          token.subRole = user.subRole
          token.phone = user.phone
          token.address = user.address
          token.isVerified = user.isVerified
          token.isSubscribed = user.isSubscribed
          token.picture = user.image
        }
      }

      // ⏰ Refresh access token if expired (with 60s buffer)
      // Falls back to decoding the JWT expiry for existing sessions without stored expiry
      if (token.accessToken && token.refreshToken) {
        const expiry =
          token.accessTokenExpires ?? getJwtExpiry(token.accessToken) ?? 0
        const now = Date.now()
        const bufferMs = 60 * 1000 // refresh 60s before actual expiry
        if (expiry > 0 && now > expiry - bufferMs) {
          const newAccessToken = await refreshAccessToken(token.refreshToken)
          if (newAccessToken) {
            token.accessToken = newAccessToken
            token.accessTokenExpires = getJwtExpiry(newAccessToken) ?? 0
          } else {
            // Refresh failed — log the user out
            return {} as any
          }
        }
      }

      if (trigger === "update" && token.accessToken) {
        try {
          const res = await fetch(`${BACKEND}/api/v1/subscription/status`, {
            headers: { Authorization: `Bearer ${token.accessToken}` },
          })
          const data = await res.json()
          if (data.success) {
            token.isSubscribed = data.data.isSubscribed
            token.phone = data.data.phone ?? token.phone
            token.address = data.data.address ?? token.address
          }
        } catch {
          /* backend unreachable */
        }
      }

      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as "USER" | "ADMIN" | "SUPER_ADMIN"
      session.user.subRole = token.subRole as "RIDER" | "DRIVER"
      session.user.accessToken = token.accessToken as string
      session.user.phone = token.phone as string | undefined
      session.user.address = token.address as string | undefined
      session.user.isVerified = token.isVerified as boolean
      session.user.isSubscribed = token.isSubscribed as boolean
      session.user.image = (token.picture as string) || null
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    newUser: "/auth/new-user",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
}
