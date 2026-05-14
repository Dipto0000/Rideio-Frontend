import { MapPin, Circle, CircleCheck, Clock, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface RideCardProps {
  name: string
  from: string
  to: string
}

export function RideCard({ name, from, to }: RideCardProps) {
  return (
    <Card className="p-5 border border-border/40 bg-card hover:bg-card/80 hover:border-border/60 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center gap-3 mb-5">
        <Avatar className="w-10 h-10 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground">{name}</span>
          <div className="flex items-center gap-1">
            <CircleCheck className="w-3 h-3 text-green-500" />
            <span className="text-[10px] font-semibold text-green-600 uppercase tracking-wider">
              Verified Rider
            </span>
          </div>
        </div>
      </div>

      <div className="relative pl-4">
        {/* Vertical line */}
        <div className="absolute left-[3.5px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary to-secondary/50 rounded-full" />

        {/* Pickup */}
        <div className="flex items-center gap-3 pb-3">
          <div className="w-2 h-2 rounded-full bg-primary ring-2 ring-primary/20 shrink-0" />
          <span className="text-sm text-muted-foreground font-medium">{from}</span>
        </div>

        {/* Dropoff */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-secondary ring-2 ring-secondary/20 shrink-0" />
          <span className="text-sm text-muted-foreground font-medium">{to}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Available now</span>
        </div>
        <span className="text-xs font-semibold text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          View details <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Card>
  )
}
