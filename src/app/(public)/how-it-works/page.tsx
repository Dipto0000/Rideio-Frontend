import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HowItWorksTabs } from "@/components/home/HowItWorksTabs"

const FAQS = [
  {
    q: "Is Rideio available in my city?",
    a: "Rideio is currently operating in Dhaka, Chattogram, and expanding to more cities across Bangladesh. Check back soon for new locations.",
  },
  {
    q: "How are fares calculated?",
    a: "Fares are calculated based on distance, estimated travel time, and current demand. You'll always see the fare before confirming a ride.",
  },
  {
    q: "Can I cancel a ride?",
    a: "Yes, riders can cancel a ride before it starts. If a driver is already on the way, excessive cancellations may result in restrictions.",
  },
  {
    q: "How do I receive payments as a driver?",
    a: "Drivers receive payments directly to their linked mobile banking account (bKash, Nagad, or bank transfer) on a weekly basis.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28 px-6 md:px-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight leading-[1.1] mb-4">
            How It Works
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you&apos;re a rider or a driver, Rideio makes the process simple.
          </p>
        </div>
      </section>

      {/* Tabs + Steps */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <HowItWorksTabs />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary tracking-tight text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-border/50 bg-card p-4 [&[open]>summary>.chevron]:rotate-180"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-foreground">
                  {faq.q}
                  <ChevronDown className="chevron w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-4" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of riders and drivers across Bangladesh. Sign up
            today — it&apos;s free.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/role">
              <Button variant="primary" size="lg">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
