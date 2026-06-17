"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface RideItem {
  _id: string
  createdAt: string
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function RideFrequencyChart({ rides }: { rides: RideItem[] }) {
  if (!rides?.length) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ride Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
            No ride data yet
          </div>
        </CardContent>
      </Card>
    )
  }

  const dayCounts = Array(7).fill(0)
  rides.forEach((r) => {
    const day = new Date(r.createdAt).getDay()
    dayCounts[day]++
  })

  const chartData = DAYS.map((day, i) => ({
    day,
    count: dayCounts[i],
  }))

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Ride Frequency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value) => [value, "Rides"]}
              />
              <Bar
                dataKey="count"
                fill="var(--color-secondary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
