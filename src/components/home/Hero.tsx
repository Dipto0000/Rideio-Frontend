import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookingCard } from "./BookingCard"
import { Shield, Star, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const STATS = [
  { icon: Users, value: "Growing", label: "Community" },
  { icon: Star, value: "Trusted", label: "Platform" },
  { icon: Shield, value: "Verified", label: "Drivers" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.04] via-background to-background py-20 md:py-28 px-6 md:px-12">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large floating orbs — visible colors with soft blur */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-secondary/40 via-secondary/20 to-transparent blur-[120px] animate-float-slow" />
        <div
          className="absolute top-1/3 -left-48 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/30 via-primary/15 to-transparent blur-[120px] animate-float-medium"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-amber-500/30 via-purple-500/20 to-transparent blur-[120px] animate-float-medium"
          style={{ animationDelay: "-12s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-secondary/25 to-primary/20 blur-[100px] animate-float-fast"
          style={{ animationDelay: "-3s" }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.1]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 0.5px, transparent 0.5px),
              linear-gradient(90deg, hsl(var(--foreground)) 0.5px, transparent 0.5px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 0.5px, transparent 0.5px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '10px 10px',
          }}
        />

        {/* Top accent light leak */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-primary/8 to-transparent blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-semibold text-primary tracking-wide">
                Now Available in Dhaka & Chattogram
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.05] tracking-tight">
                Your Journey,{" "}
                <span className="text-secondary">Shared.</span>
                <br />
                Your Earnings,{" "}
                <span className="text-secondary">Simplified.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
                The most reliable community-driven transport network in Bangladesh.
                Connect with verified riders and drivers heading your way.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/auth/role">
                <Button variant="primary" size="lg" className="text-base px-8 h-12">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="lg" className="text-base px-8 h-12">
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Community avatars */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar
                    key={i}
                    className="border-2 border-background w-10 h-10 ring-2 ring-background"
                  >
                    <AvatarImage
                      src={`https://i.pravatar.cc/100?u=${i + 10}`}
                      alt={`User ${i}`}
                    />
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      U{i}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">
                  Join Our Community
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Growing community every day
                </span>
              </div>
            </div>
          </div>

          {/* Right: BookingCard */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-8 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent rounded-3xl blur-2xl opacity-60" />
              <div className="relative">
                <BookingCard />
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 md:mt-20 grid grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-card/50 border border-border/30"
            >
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="text-lg md:text-xl font-bold text-primary">
                {stat.value}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
