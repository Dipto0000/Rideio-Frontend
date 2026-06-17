import { Car, Clock, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const BREAKDOWN = [
  { label: "Avg. Weekly Earnings", value: "৳4,500–6,500", icon: Wallet },
  { label: "Flexible Hours", value: "Set your own", icon: Clock },
  { label: "Peak Hour Bonus", value: "Up to 20% more", icon: TrendingUp },
  { label: "Subscription", value: "৳700/month", icon: Car },
]

export function DriverEarnings() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-card border-y border-border/40">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual bar chart */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
              Drive on Your Terms.{" "}
              <span className="text-secondary">Earn on Your Schedule.</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              No commission cuts. No minimum hours. Just a flat ৳700/month subscription
              and you keep every taka you earn.
            </p>

            {/* Mini bar chart */}
            <div className="rounded-xl border border-border/40 bg-background p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Weekly earning potential (৳)
              </p>
              <div className="space-y-3">
                {[
                  { day: "Mon", amount: 850, pct: 65 },
                  { day: "Tue", amount: 720, pct: 55 },
                  { day: "Wed", amount: 940, pct: 72 },
                  { day: "Thu", amount: 1100, pct: 85 },
                  { day: "Fri", amount: 1280, pct: 98 },
                  { day: "Sat", amount: 1050, pct: 81 },
                  { day: "Sun", amount: 920, pct: 71 },
                ].map((d) => (
                  <div key={d.day} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground w-7">{d.day}</span>
                    <div className="flex-1 h-5 rounded-md bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-md bg-secondary/70"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground w-14 text-right">
                      ৳{d.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="space-y-4">
            {BREAKDOWN.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border border-border/30 bg-background p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                  <p className="text-base font-bold text-foreground">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link href="/auth/role">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Driving Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
