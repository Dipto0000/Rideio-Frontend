import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export default function ProtectedNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-6">
        <MapPin className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex gap-3">
        <Link href="/dashboard">
          <Button variant="primary">Go to Dashboard</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
