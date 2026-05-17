import type { Metadata } from "next"
import { CompleteProfileForm } from "@/components/modules/Auth/CompleteProfileForm"

export const metadata: Metadata = {
  title: "Complete Profile - Rideio",
}

export default function CompleteProfilePage() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8 shadow-sm">
      <CompleteProfileForm />
    </div>
  )
}
