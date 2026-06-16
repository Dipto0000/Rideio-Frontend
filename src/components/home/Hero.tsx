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
    <section className="relative overflow-hidden bg-background py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit">
              <span className="h-2 w-2 rounded-full bg-primary" />
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
            <BookingCard />
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
