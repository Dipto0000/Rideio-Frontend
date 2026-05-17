"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isAfter,
  startOfDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface DOBPickerProps {
  value: string
  onChange: (value: string) => void
}

export function DOBPicker({ value, onChange }: DOBPickerProps) {
  const [open, setOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value) : new Date(2000, 0, 1)
  )
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const today = startOfDay(new Date())

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const startPadding = getDay(startOfMonth(currentMonth))

  const handleDateClick = useCallback(
    (date: Date) => {
      if (isAfter(date, today)) return
      onChange(format(date, "yyyy-MM-dd"))
      setOpen(false)
    },
    [today, onChange]
  )

  const displayValue = value
    ? format(new Date(value + "T00:00:00"), "MMM d, yyyy")
    : ""

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-full items-center gap-3 rounded-xl border bg-muted/20 px-3.5 text-sm transition-all hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary border-border/50"
      >
        <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? displayValue : "Date of Birth"}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 animate-fade-slide-up">
          <div className="rounded-xl border border-border bg-card p-4 shadow-lg">
            {/* Year & Month navigation */}
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="rounded-lg p-1.5 transition-colors hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                <select
                  value={currentMonth.getMonth()}
                  onChange={(e) =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        parseInt(e.target.value),
                        1
                      )
                    )
                  }
                  className="rounded-lg border border-border bg-muted/30 px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i} value={i}>
                      {format(new Date(2000, i, 1), "MMMM")}
                    </option>
                  ))}
                </select>
                <select
                  value={currentMonth.getFullYear()}
                  onChange={(e) =>
                    setCurrentMonth(
                      new Date(
                        parseInt(e.target.value),
                        currentMonth.getMonth(),
                        1
                      )
                    )
                  }
                  className="rounded-lg border border-border bg-muted/30 px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {Array.from({ length: 100 })
                    .map((_, i) => new Date().getFullYear() - i)
                    .map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="rounded-lg p-1.5 transition-colors hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Weekday labels */}
            <div className="mb-1 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="py-1 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startPadding }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {days.map((date) => {
                const future = isAfter(date, today)
                const selected =
                  value === format(date, "yyyy-MM-dd")
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={future}
                    onClick={() => handleDateClick(date)}
                    className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                      selected
                        ? "bg-secondary text-secondary-foreground shadow-sm"
                        : future
                          ? "cursor-not-allowed text-muted-foreground/30"
                          : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {format(date, "d")}
                  </button>
                )
              })}
            </div>

            {/* Footer hint */}
            <p className="mt-3 text-[11px] text-muted-foreground">
              Select your date of birth
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
