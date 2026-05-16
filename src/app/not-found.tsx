import Link from "next/link"
import { ArrowLeft, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/10">
        <MapPin className="h-10 w-10 text-secondary" />
      </div>
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Looks like you&apos;ve taken a wrong turn.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        This page doesn&apos;t exist or has been moved.
      </p>
      <Button
        variant="primary"
        className="mt-8 h-11 rounded-xl px-6"
        asChild
      >
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back home
        </Link>
      </Button>
    </div>
  )
}
