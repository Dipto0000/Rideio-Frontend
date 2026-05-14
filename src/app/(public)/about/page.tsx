import { Users, Shield, Sparkles, Globe, Heart, Target } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const VALUES = [
  {
    icon: Shield,
    title: "Safety First",
    description:
      "We verify every driver and rider. Your security is built into every ride with real-time tracking, SOS alerts, and insurance coverage.",
  },
  {
    icon: Sparkles,
    title: "Community Driven",
    description:
      "Rideio is built by the community, for the community. We connect neighbours and create shared value for everyone involved.",
  },
  {
    icon: Globe,
    title: "Sustainable Transport",
    description:
      "By sharing rides, we reduce traffic congestion and carbon emissions. Every shared ride is a step toward a greener Bangladesh.",
  },
  {
    icon: Heart,
    title: "Inclusive Access",
    description:
      "We believe reliable transportation should be accessible to all. Our platform serves every neighbourhood, from the city centre to the suburbs.",
  },
  {
    icon: Target,
    title: "Fair Earnings",
    description:
      "Drivers keep the majority of every fare. No hidden fees, no surprise deductions. We believe in transparent, fair compensation.",
  },
  {
    icon: Users,
    title: "24/7 Support",
    description:
      "Our support team is available around the clock. Whether you need help with a ride, payment, or account — we're here for you.",
  },
]

const TEAM = [
  { name: "Farhan Rahman", role: "Founder & CEO", initials: "FR" },
  { name: "Nusrat Jahan", role: "Head of Operations", initials: "NJ" },
  { name: "Tanvir Ahmed", role: "CTO", initials: "TA" },
  { name: "Sadia Islam", role: "Head of Community", initials: "SI" },
]

const STATS = [
  { value: "50K+", label: "Rides Completed" },
  { value: "10K+", label: "Verified Drivers" },
  { value: "30+", label: "Cities in Bangladesh" },
  { value: "4.8", label: "Average Rating" },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28 px-6 md:px-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight leading-[1.1] mb-4">
            About Rideio
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We&apos;re on a mission to transform the way Bangladesh travels —
            making transportation safer, more affordable, and community-driven.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl border border-border/50 bg-card"
              >
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight text-center mb-8">
            Our Story
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
            <p className="text-base leading-relaxed">
              Rideio was born in Dhaka in 2023, out of a simple observation: getting
              around one of the world&apos;s most vibrant cities shouldn&apos;t be a struggle.
              Our founders experienced the daily challenges of Dhaka&apos;s traffic
              first-hand — the long waits, the unreliable transport, the lack of
              safety guarantees.
            </p>
            <p className="text-base leading-relaxed">
              We built Rideio to solve these problems. Not by reinventing the wheel,
              but by bringing people together. Our platform connects riders and
              drivers who are already heading the same way, turning empty seats into
              opportunities and commutes into connections.
            </p>
            <p className="text-base leading-relaxed">
              Today, Rideio serves thousands of users across Bangladesh, from busy
              professionals in Gulshan to students in Uttara. But our mission
              remains the same: make transport safe, affordable, and human again.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-3">
              What We Stand For
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our values guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-border hover:shadow-sm transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-3">
              Meet the Team
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The people behind Rideio, working every day to make your journey
              better.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="text-center p-6 rounded-2xl border border-border/50 bg-card hover:shadow-sm transition-all duration-200"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-primary">
                    {member.initials}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{member.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-4">
            Be Part of the Journey
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Whether you&apos;re riding, driving, or partnering with us — welcome to the
            Rideio community. Let&apos;s move Bangladesh forward, together.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/role">
              <Button variant="primary" size="lg">
                Join Rideio
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
