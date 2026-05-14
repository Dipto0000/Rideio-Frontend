import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-primary/[0.03] via-background to-background px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
