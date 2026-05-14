"use client"

import { type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  icon: ReactNode
  label: string
  value: string | number
  accentColor?: string
}

export function StatsCard({ icon, label, value, accentColor = "bg-secondary" }: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${accentColor}`} />
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
            <div className="text-secondary">{icon}</div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
