import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "USER" | "ADMIN" | "SUPER_ADMIN"
      subRole: "RIDER" | "DRIVER"
      accessToken: string
      phone?: string
      address?: string
      isVerified: boolean
      isSubscribed: boolean
    } & DefaultSession["user"]
  }

  interface User {
    accessToken: string
    refreshToken: string
    role: "USER" | "ADMIN" | "SUPER_ADMIN"
    subRole: "RIDER" | "DRIVER"
    phone?: string
    address?: string
    isVerified: boolean
    isSubscribed: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    role: "USER" | "ADMIN" | "SUPER_ADMIN"
    subRole: "RIDER" | "DRIVER"
    phone?: string
    address?: string
    isVerified: boolean
    isSubscribed: boolean
  }
}