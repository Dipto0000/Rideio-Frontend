import type { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="py-8 overflow-hidden">{children}</div>
}
