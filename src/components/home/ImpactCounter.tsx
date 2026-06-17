"use client"

import { useEffect, useState, useRef } from "react"
import { Users, Car, MapPin, Shield } from "lucide-react"

const IMPACTS = [
  { icon: Users, value: 12400, label: "Community Members", suffix: "+" },
  { icon: Car, value: 5800, label: "Rides Completed", suffix: "+" },
  { icon: MapPin, value: 16, label: "Cities & Districts", suffix: "" },
  { icon: Shield, value: 3200, label: "Verified Drivers", suffix: "+" },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasAnimated.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1800
          const steps = 40
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function ImpactCounter() {
  return (
    <section className="py-16 md:py-20 px-6 md:px-12 bg-card border-y border-border/40">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {IMPACTS.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-primary">
                <AnimatedCounter target={item.value} suffix={item.suffix} />
              </p>
              <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
