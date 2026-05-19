import type { Metadata } from "next"
import { RoleSelector } from "@/components/modules/Auth/RoleSelector"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Choose Your Role",
  description: "Sign up as a rider or driver on Rideio.",
}

export default function RolePage() {
  return <RoleSelector />
}
