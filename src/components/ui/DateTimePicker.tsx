"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
  getDay,
  setHours,
  setMinutes,
} from "date-fns"
import { CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react"

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
}

const TIME_SLOTS = [
  { label: "Morning", time: "09:00", icon: "☀️" },
  { label: "Afternoon", time: "14:00", icon: "🌤️" },
  { label: "Evening", time: "20:00", icon: "🌙" },
]

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"date" | "time">("date")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  )
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setTimeout(() => setStep("date"), 200)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const tomorrow = startOfDay(addDays(new Date(), 1))

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const startPadding = getDay(startOfMonth(currentMonth))

  const handleDateClick = useCallback(
    (date: Date) => {
      if (isBefore(date, tomorrow) && !isToday(date)) return
      setSelectedDate(date)
      setStep("time")
    },
    [tomorrow]
  )

  const handleTimeSelect = useCallback(
    (time: string) => {
      if (!selectedDate) return
      const [hours, minutes] = time.split(":").map(Number)
      const dateTime = setMinutes(setHours(selectedDate, hours), minutes)
      onChange(dateTime.toISOString())
      setOpen(false)
      setTimeout(() => setStep("date"), 200)
    },
    [selectedDate, onChange]
  )

  const handleCustomTime = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedDate || !e.target.value) return
      const [hours, minutes] = e.target.value.split(":").map(Number)
      const dateTime = setMinutes(setHours(selectedDate, hours), minutes)
      onChange(dateTime.toISOString())
    },
    [selectedDate, onChange]
  )

  const displayValue = value
    ? (() => {
        const d = new Date(value)
        return `${format(d, "EEE, MMM d")} • ${format(d, "h:mm a")}`
      })()
    : ""

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-12 w-full items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 text-sm transition-all hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? displayValue : "Select arrival date & time"}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 animate-fade-slide-up">
          <div className="rounded-xl border border-border bg-card p-4 shadow-lg">
            {step === "date" ? (
              <>
                {/* Month header */}
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="rounded-lg p-1.5 transition-colors hover:bg-muted"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-foreground">
                    {format(currentMonth, "MMMM yyyy")}
                  </span>
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
                    const past = isBefore(date, tomorrow) && !isToday(date)
                    const today = isToday(date)
                    const selected =
                      selectedDate &&
                      format(selectedDate, "yyyy-MM-dd") ===
                        format(date, "yyyy-MM-dd")
                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        disabled={past}
                        onClick={() => handleDateClick(date)}
                        className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                          selected
                            ? "bg-secondary text-secondary-foreground shadow-sm"
                            : today
                              ? "border border-secondary/30 bg-secondary/10 text-secondary"
                              : past
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
                  Earliest available: {format(tomorrow, "MMM d, yyyy")}
                </p>
              </>
            ) : (
              <>
                {/* Back to date picker */}
                <div className="mb-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("date")}
                    className="rounded-lg p-1.5 transition-colors hover:bg-muted"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-foreground">
                    {selectedDate && format(selectedDate, "EEE, MMM d")}
                  </span>
                </div>

                {/* Time slot cards */}
                <div className="mb-3 grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const slotHour = parseInt(slot.time.split(":")[0])
                    const isSelected =
                      value &&
                      new Date(value).getHours() === slotHour &&
                      new Date(value).getMinutes() ===
                        parseInt(slot.time.split(":")[1])
                    return (
                      <button
                        key={slot.label}
                        type="button"
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                          isSelected
                            ? "border-secondary bg-secondary/10 text-secondary"
                            : "border-border hover:border-secondary/40 hover:bg-muted/30"
                        }`}
                      >
                        <span className="text-lg">{slot.icon}</span>
                        <span className="text-xs font-medium">{slot.label}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {format(
                            setHours(setMinutes(new Date(), 0), slotHour),
                            "h:mm a"
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Custom time */}
                <div className="flex items-center gap-3 border-t border-border pt-3">
                  <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    type="time"
                    defaultValue={
                      selectedDate
                        ? format(selectedDate, "HH:mm")
                        : "12:00"
                    }
                    onChange={handleCustomTime}
                    className="flex h-10 flex-1 rounded-lg border border-border bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <span className="text-xs text-muted-foreground">Custom</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** Helper since date-fns doesn't export addDays at the top level in all setups */
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
