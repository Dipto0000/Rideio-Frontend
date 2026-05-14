"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"

const themes = [
  { value: "system", icon: Monitor, label: "System" },
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors"
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4" />
      </button>
    )
  }

  const currentIndex = themes.findIndex((t) => t.value === theme)
  const nextTheme = themes[(currentIndex + 1) % themes.length]

  return (
    <button
      onClick={() => setTheme(nextTheme.value)}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      aria-label={`Switch to ${nextTheme.label} mode`}
      title={`Current: ${theme === "system" ? "System" : theme === "light" ? "Light" : "Dark"}`}
    >
      {theme === "system" ? (
        <Monitor className="h-4 w-4" />
      ) : theme === "light" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
