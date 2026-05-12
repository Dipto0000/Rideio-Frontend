import { MapPin, CircleCheck, Circle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface RideCardProps {
  name: string
  from: string
  to: string
}

export function RideCard({ name, from, to }: RideCardProps) {
  return (
    <Card className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <Avatar className="w-10 h-10 bg-muted">
          <AvatarFallback className="bg-muted text-primary font-bold">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-primary">{name}</span>
          <div className="flex items-center gap-1 text-[10px] text-secondary font-bold">
            <CircleCheck className="w-3 h-3" />
            <span>Verified</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 relative">
        <div className="flex items-center gap-3">
          <Circle className="w-3 h-3 text-primary fill-primary" />
          <span className="text-sm font-medium text-muted-foreground">{from}</span>
        </div>
        
        {/* Connecting line */}
        <div className="absolute left-[5.5px] top-[14px] w-[1px] h-[16px] bg-border" />
        
        <div className="flex items-center gap-3">
          <MapPin className="w-3 h-3 text-secondary" />
          <span className="text-sm font-medium text-muted-foreground">{to}</span>
        </div>
      </div>
    </Card>
  )
}
