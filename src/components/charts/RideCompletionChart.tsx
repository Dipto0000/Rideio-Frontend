"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface Props {
  completed: number
  cancelled: number
  active: number
  totalLabel?: string
}

const COLORS = ["var(--color-secondary)", "var(--muted-foreground)", "var(--color-primary)"]

export function RideCompletionChart({ completed, cancelled, active, totalLabel = "Rides" }: Props) {
  const data = [
    { name: "Completed", value: completed },
    { name: "Cancelled", value: cancelled },
    { name: "Active", value: active },
  ].filter((d) => d.value > 0)

  const total = completed + cancelled + active

  if (!total) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ride Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
            No ride data yet
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Ride Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={52}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {data.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-semibold text-foreground ml-auto">
                  {Math.round((item.value / total) * 100)}%
                </span>
              </div>
            ))}
            <div className="pt-1 text-xs text-muted-foreground">
              {total} total {totalLabel}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
