import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { RideCard } from "./RideCard"

const LATEST_RIDES = [
  { id: "1", name: "Rahim U.", from: "Gulshan 1", to: "Motijheel" },
  { id: "2", name: "Sadia K.", from: "Banani", to: "Dhanmondi" },
  { id: "3", name: "Tariq M.", from: "Uttara Sector 4", to: "Mohakhali" },
]

export function LiveFeed() {
  return (
    <section className="py-16 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-primary tracking-tight">
              Live Feed Preview
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Sneak Peek of latest community rides.
            </p>
          </div>
          
          <Link href="/rides" className="flex items-center gap-1 text-sm font-bold text-secondary hover:underline transition-all">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LATEST_RIDES.map((ride) => (
            <RideCard key={ride.id} name={ride.name} from={ride.from} to={ride.to} />
          ))}
        </div>
      </div>
    </section>
  )
}
