"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from "react-leaflet"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import L from "leaflet"

const fromIcon = L.divIcon({
  className: "bg-transparent",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#006b5f" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

const toIcon = L.divIcon({
  className: "bg-transparent",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#dc2626" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

interface Suggestion {
  display_name: string
  lat: string
  lon: string
}

interface Point {
  address: string
  lat: number
  lng: number
}

interface RideMapPickerProps {
  from: Point | null
  to: Point | null
  onFromChange: (loc: Point) => void
  onToChange: (loc: Point) => void
}

function MapClickHandler({
  onMapClick,
  setTargetField,
}: {
  onMapClick: (lat: number, lng: number, field: "from" | "to") => void
  setTargetField: React.Dispatch<React.SetStateAction<"from" | "to" | null>>
}) {
  useMapEvents({
    click(e) {
      setTargetField((prev) => {
        const field = prev || "from"
        onMapClick(e.latlng.lat, e.latlng.lng, field)
        return null
      })
    },
  })
  return null
}

function FitBounds({ points }: { points: { lat: number; lng: number }[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length >= 2) {
      map.fitBounds(
        points.map((p) => [p.lat, p.lng]),
        { padding: [60, 60], duration: 1 }
      )
    }
  }, [points, map])
  return null
}

async function geocode(query: string): Promise<Suggestion | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=bd`
    )
    const data: Suggestion[] = await res.json()
    return data[0] || null
  } catch {
    return null
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    )
    const data = await res.json()
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}

function SearchField({
  query,
  onQueryChange,
  onSelect,
  placeholder,
  icon,
  color,
}: {
  query: string
  onQueryChange: (val: string) => void
  onSelect: (point: Point) => void
  placeholder: string
  icon: React.ReactNode
  color: string
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleInput(val: string) {
    onQueryChange(val)
    clearTimeout(timer.current)
    if (val.length < 3) { setSuggestions([]); setOpen(false); return }
    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5&countrycodes=bd`
        )
        setSuggestions(await res.json())
        setOpen(true)
      } catch { setSuggestions([]) }
      finally { setLoading(false) }
    }, 400)
  }

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      const s = await geocode(query)
      if (s) {
        onSelect({ address: s.display_name, lat: parseFloat(s.lat), lng: parseFloat(s.lon) })
        setOpen(false)
      }
    }
  }

  function handleSuggestionClick(s: Suggestion) {
    onSelect({ address: s.display_name, lat: parseFloat(s.lat), lng: parseFloat(s.lon) })
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        {icon}
        <Input
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 h-11 bg-background pr-10"
          style={{ borderLeft: `3px solid ${color}` }}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="absolute z-[9999] w-full bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(s)}
              className="px-4 py-3 text-sm hover:bg-muted cursor-pointer border-b border-border last:border-0 transition-colors"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function RideMapPicker({ from, to, onFromChange, onToChange }: RideMapPickerProps) {
  const [fromQuery, setFromQuery] = useState(from?.address || "")
  const [toQuery, setToQuery] = useState(to?.address || "")
  const [targetField, setTargetField] = useState<"from" | "to" | null>(null)
  const defaultCenter: [number, number] = [23.8103, 90.4125]

  useEffect(() => { setFromQuery(from?.address || "") }, [from?.address])
  useEffect(() => { setToQuery(to?.address || "") }, [to?.address])

  const handleFromSelect = useCallback((point: Point) => {
    setFromQuery(point.address)
    onFromChange(point)
  }, [onFromChange])

  const handleToSelect = useCallback((point: Point) => {
    setToQuery(point.address)
    onToChange(point)
  }, [onToChange])

  const handleMapClick = useCallback(async (lat: number, lng: number, field: "from" | "to") => {
    const address = await reverseGeocode(lat, lng)
    const point = { address, lat, lng }
    if (field === "from") handleFromSelect(point)
    else handleToSelect(point)
  }, [handleFromSelect, handleToSelect])

  const points: { lat: number; lng: number }[] = []
  if (from) points.push(from)
  if (to) points.push(to)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => setTargetField("from")}
          className={`px-3 py-1.5 rounded-md border transition-colors ${targetField === "from" ? "border-secondary bg-secondary/10 text-secondary" : "border-border hover:border-secondary/50"}`}
        >
          Click map to set: {targetField === "from" ? "Pickup" : "Pickup"}
        </button>
        <button
          type="button"
          onClick={() => setTargetField("to")}
          className={`px-3 py-1.5 rounded-md border transition-colors ${targetField === "to" ? "border-red-500 bg-red-50 text-red-600" : "border-border hover:border-red-500/50"}`}
        >
          Click map to set: {targetField === "to" ? "Drop-off" : "Drop-off"}
        </button>
      </div>

      <SearchField
        query={fromQuery}
        onQueryChange={setFromQuery}
        onSelect={handleFromSelect}
        placeholder="Pickup location..."
        icon={<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />}
        color="#006b5f"
      />

      <SearchField
        query={toQuery}
        onQueryChange={setToQuery}
        onSelect={handleToSelect}
        placeholder="Drop-off location..."
        icon={<Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />}
        color="#dc2626"
      />

      <div className="h-72 md:h-96 rounded-xl overflow-hidden border border-border">
        <MapContainer
          center={from ? [from.lat, from.lng] : defaultCenter}
          zoom={from ? 12 : 6}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} setTargetField={setTargetField} />
          <FitBounds points={points} />
          {from && <Marker position={[from.lat, from.lng]} icon={fromIcon} />}
          {to && <Marker position={[to.lat, to.lng]} icon={toIcon} />}
          {from && to && (
            <Polyline
              positions={[
                [from.lat, from.lng],
                [to.lat, to.lng],
              ]}
              color="#006b5f"
              weight={3}
              dashArray="8 4"
            />
          )}
        </MapContainer>
      </div>
    </div>
  )
}
