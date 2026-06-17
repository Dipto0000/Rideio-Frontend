import { MapPin, CheckCircle, Clock } from "lucide-react"

const CITIES = [
  {
    name: "Dhaka",
    division: "Dhaka Division",
    status: "active" as const,
    routes: "Gulshan, Banani, Dhanmondi, Uttara, Mirpur, Motijheel",
    riders: "8,400+",
    drivers: "2,100+",
  },
  {
    name: "Chattogram",
    division: "Chattogram Division",
    status: "active" as const,
    routes: "Agrabad, GEC, Halishahar, Nasirabad, Patenga",
    riders: "3,200+",
    drivers: "1,100+",
  },
  {
    name: "Sylhet",
    division: "Sylhet Division",
    status: "coming-soon" as const,
    routes: "Upcoming — Q3 2026",
    riders: "—",
    drivers: "—",
  },
  {
    name: "Rajshahi",
    division: "Rajshahi Division",
    status: "coming-soon" as const,
    routes: "Upcoming — Q4 2026",
    riders: "—",
    drivers: "—",
  },
]

export function CoverageCities() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
            Growing Across Bangladesh
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            From the capital to the port city — we&apos;re expanding to connect communities nationwide.
          </p>
        </div>

        {/* City Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CITIES.map((city) => (
            <div
              key={city.name}
              className={`rounded-2xl border p-6 ${
                city.status === "active"
                  ? "bg-card border-border/40"
                  : "bg-card/50 border-dashed border-border/20"
              }`}
            >
              {/* Status badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${city.status === "active" ? "text-secondary" : "text-muted-foreground"}`} />
                  <h3 className="text-lg font-bold text-foreground">{city.name}</h3>
                </div>
                {city.status === "active" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    Coming Soon
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-3">{city.division}</p>

              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground leading-relaxed">{city.routes}</p>
              </div>

              {city.status === "active" && (
                <div className="mt-4 pt-4 border-t border-border/30 flex items-center gap-4 text-xs text-muted-foreground">
                  <span><strong className="text-foreground">{city.riders}</strong> Riders</span>
                  <span><strong className="text-foreground">{city.drivers}</strong> Drivers</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
