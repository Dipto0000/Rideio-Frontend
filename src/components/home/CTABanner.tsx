import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-secondary/20 p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-4">
            Ready to Join the Journey?
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            Whether you&apos;re heading to work or looking to earn — Rideio connects you
            with your community. No surge pricing, no hidden fees.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/role">
              <Button variant="primary" size="lg" className="text-base px-8 h-12">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="text-base px-8 h-12">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
