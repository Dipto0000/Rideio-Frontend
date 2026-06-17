"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const COLORS: Record<string, string> = {
  COMPLETED: "#10b981",
  PENDING: "#f59e0b",
  ACCEPTED: "#3b82f6",
  IN_PROGRESS: "#8b5cf6",
  CANCELLED: "#ef4444",
}

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In Progress",
  CANCELLED: "Cancelled",
}

export function StatusDistributionChart({
  ridesByStatus,
}: {
  ridesByStatus: Record<string, number>
}) {
  const entries = Object.entries(ridesByStatus).filter(([, count]) => count > 0)
  const total = entries.reduce((sum, [, count]) => sum + count, 0)

  if (!total) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ride Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
            No ride data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const data = entries.map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    status,
  }))

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Ride Status Distribution</CardTitle>
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
                  {data.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={COLORS[entry.status] || "#6b7280"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 flex-1">
            {data.map((entry) => (
              <div key={entry.status} className="flex items-center gap-2 text-sm">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[entry.status] || "#6b7280" }}
                />
                <span className="text-muted-foreground capitalize">
                  {entry.name}
                </span>
                <span className="font-semibold text-foreground ml-auto">
                  {entry.value}
                </span>
              </div>
            ))}
            <div className="pt-1 text-xs text-muted-foreground">
              {total} total rides
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
