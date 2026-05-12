import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      {children}
    </div>
  )
}
