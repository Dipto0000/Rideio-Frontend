import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookingCard } from "./BookingCard"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24 px-6 md:px-12 bg-dotted">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-6xl font-bold text-primary leading-[1.1] tracking-tight">
              Your Journey, Shared.<br />
              Your Earnings, Simplified.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              The most reliable community-driven transport network in Bangladesh.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <Avatar key={i} className="border-2 border-background w-10 h-10">
                  <AvatarImage src={`https://i.pravatar.cc/100?u=${i}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-primary">Join The Fast Growing Community</span>
              <span className="text-xs text-secondary font-medium">✓ Trusted by many</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center lg:justify-end">
          <BookingCard />
        </div>
      </div>
    </section>
  )
}
