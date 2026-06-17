import { Shield, BadgeCheck, PhoneCall, MessageCircle, type LucideIcon } from "lucide-react"

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    description:
      "Every rider and driver is verified through our multi-step process. Government ID, phone, and email verification ensure accountability.",
  },
  {
    icon: Shield,
    title: "Ride Insurance",
    description:
      "All rides are covered by our insurance partner. From accidental coverage to baggage protection — ride with confidence.",
  },
  {
    icon: MessageCircle,
    title: "Community Ratings",
    description:
      "Transparent feedback system. Each ride ends with a review, building a trusted community of reliable riders and drivers.",
  },
  {
    icon: PhoneCall,
    title: "24/7 Support",
    description:
      "Our support team is available around the clock. Report issues, get help with rides, or reach us through in-app chat or phone.",
  },
]

export function SafetyTrust() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
            Safety First, Always
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Built-in protections for every ride. Because trust is the foundation of community transport.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border/40 bg-card p-6 flex flex-col gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-secondary" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
