"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface RideItem {
  _id: string
  systemSuggestedFare: number
  createdAt: string
  status: string
}

export function EarningsTrendChart({ rides }: { rides: RideItem[] }) {
  const chartData = rides
    .filter((r) => r.status === "COMPLETED")
    .slice(-7)
    .map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString("en-BD", {
        month: "short",
        day: "numeric",
      }),
      fare: r.systemSuggestedFare || 0,
    }))

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Earnings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
            Complete rides to see your earnings trend
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Earnings Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickFormatter={(v) => `৳${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value) => [`৳${value}`, "Fare"]}
              />
              <Area
                type="monotone"
                dataKey="fare"
                stroke="var(--color-secondary)"
                fill="url(#earningsGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
