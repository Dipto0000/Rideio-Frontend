import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { RideCard } from "./RideCard"

const LATEST_RIDES = [
  { id: "1", name: "Rahim U.", from: "Gulshan 1", to: "Motijheel" },
  { id: "2", name: "Sadia K.", from: "Banani", to: "Dhanmondi" },
  { id: "3", name: "Tariq M.", from: "Uttara Sector 4", to: "Mohakhali" },
]

export function LiveFeed() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                Live Feed
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
              Recent Rides Near You
            </h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Sneak peek at the latest community rides in your area. Hop in and
              join the movement!
            </p>
          </div>

          <Link
            href="/rides"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors shrink-0"
          >
            View all rides
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LATEST_RIDES.map((ride, i) => (
            <div
              key={ride.id}
              className="animate-fade-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <RideCard name={ride.name} from={ride.from} to={ride.to} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
