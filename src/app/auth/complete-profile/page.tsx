import type { Metadata } from "next"
import { CompleteProfileForm } from "@/components/modules/Auth/CompleteProfileForm"

export const metadata: Metadata = {
  title: "Complete Profile - Rideio",
}

export default function CompleteProfilePage() {
  return (
    <div className="flex items-center justify-center p-8 w-full">
      <div className="w-full max-w-md">
        <CompleteProfileForm />
      </div>
    </div>
  )
}
