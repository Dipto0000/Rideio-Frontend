"use client"

import { Car, Motorbike } from "lucide-react"

interface VehicleTypeSelectorProps {
  value: "CAR" | "BIKE"
  onChange: (value: "CAR" | "BIKE") => void
}

const VEHICLES = [
  {
    value: "CAR" as const,
    label: "Car",
    icon: Car,
    desc: "Sedan, SUV, or hatchback",
  },
  {
    value: "BIKE" as const,
    label: "Bike",
    icon: Motorbike,
    desc: "Motorcycle or scooter",
  },
]

export function VehicleTypeSelector({
  value,
  onChange,
}: VehicleTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {VEHICLES.map((vehicle) => {
        const selected = value === vehicle.value
        const Icon = vehicle.icon
        return (
          <button
            key={vehicle.value}
            type="button"
            onClick={() => onChange(vehicle.value)}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
              selected
                ? "border-secondary bg-secondary/10 shadow-sm"
                : "border-border hover:border-secondary/40 hover:bg-muted/30"
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                selected
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <span
              className={`text-sm font-semibold ${
                selected ? "text-secondary" : "text-foreground"
              }`}
            >
              {vehicle.label}
            </span>
            <span className="text-xs text-muted-foreground">{vehicle.desc}</span>
          </button>
        )
      })}
    </div>
  )
}
