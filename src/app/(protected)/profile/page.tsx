import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import { getProfile } from "@/lib/actions/profile.actions"
import { getNotificationSettings } from "@/lib/actions/notification.actions"
import { ProfileContent } from "./_components/ProfileContent"

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your account settings, photo, and preferences.",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const [profileRes, settingsRes] = await Promise.all([
    getProfile(session.user.accessToken),
    getNotificationSettings(session.user.accessToken),
  ])

  const profile = profileRes.success && profileRes.data ? profileRes.data : {
    name: session.user.name || "",
    email: session.user.email || "",
    role: session.user.role,
    subRole: session.user.subRole,
  }

  return (
    <ProfileContent
      initialProfile={profile}
      initialSettings={settingsRes.success ? settingsRes.data : null}
    />
  )
}
