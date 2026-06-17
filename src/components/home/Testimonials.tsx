import { Star } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Fatima Begum",
    role: "Daily Commuter, Dhaka",
    quote:
      "I take rides from Gulshan to Motijheel every morning. The drivers are always on time, and the fare is fair — no surge pricing like other apps.",
    rating: 5,
    initials: "FB",
  },
  {
    name: "Kabir Hossain",
    role: "Driver, Chattogram",
    quote:
      "I've been driving with Rideio for 6 months. The earnings are consistent, and I love being able to set my own schedule around my family.",
    rating: 5,
    initials: "KH",
  },
  {
    name: "Nusrat Jahan",
    role: "University Student, Dhaka",
    quote:
      "As a student, affordable rides matter. Rideio helps me split fares with classmates heading the same way. Safe and budget-friendly.",
    rating: 5,
    initials: "NJ",
  },
  {
    name: "Rafiq Ahmed",
    role: "Business Owner, Chattogram",
    quote:
      "I use Rideio for business travel between Agrabad and the port area. Verified drivers give me peace of mind when I'm carrying documents.",
    rating: 4,
    initials: "RA",
  },
  {
    name: "Tanvir Hasan",
    role: "Driver, Dhaka",
    quote:
      "The subscription model works well for me. ৳700/month and I keep 100% of my earnings. Much better than giving a cut to traditional ride-share apps.",
    rating: 5,
    initials: "TH",
  },
  {
    name: "Ayesha Khatun",
    role: "Homemaker, Dhaka",
    quote:
      "My husband uses Rideio daily for work. The live tracking feature helps me know when he's reaching home. Simple things that matter.",
    rating: 5,
    initials: "AK",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-card overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
            What Our Community Says
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Real stories from riders and drivers across Bangladesh.
          </p>
        </div>

        {/* Pure CSS Marquee — Row 1 */}
        <div className="relative w-full overflow-hidden mask-fade-x">
          <div className="flex gap-5 marquee-animate-left" style={{ width: "max-content" }}>
            {/* Render twice for seamless loop */}
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <TestimonialCard key={`r1-${i}`} {...t} />
            ))}
          </div>
        </div>

        {/* Pure CSS Marquee — Row 2 (reverse direction) */}
        <div className="relative w-full overflow-hidden mask-fade-x mt-5">
          <div className="flex gap-5 marquee-animate-right" style={{ width: "max-content" }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <TestimonialCard key={`r2-${i}`} {...t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  name,
  role,
  quote,
  rating,
  initials,
}: {
  name: string
  role: string
  quote: string
  rating: number
  initials: string
}) {
  return (
    <div className="w-72 md:w-80 shrink-0 rounded-xl border border-border/40 bg-background p-5 flex flex-col gap-3">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-foreground leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-border/20">
        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{role}</p>
        </div>
      </div>
    </div>
  )
}
