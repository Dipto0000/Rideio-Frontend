"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import { MapPin, Loader2, Crosshair } from "lucide-react"
import { Input } from "@/components/ui/input"
import L from "leaflet"

const icon = L.divIcon({
  className: "bg-transparent",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#006b5f" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

interface Suggestion {
  display_name: string
  lat: string
  lon: string
}

interface LocationPickerProps {
  value: string
  onChange: (location: { address: string; lat: number; lng: number }) => void
  placeholder?: string
  icon?: React.ReactNode
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 1 })
  }, [lat, lng, map])
  return null
}

export function LocationPicker({
  value,
  onChange,
  placeholder = "Search location...",
  icon: customIcon,
}: LocationPickerProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const ref = useRef<HTMLDivElement>(null)

  const defaultCenter: [number, number] = [23.8103, 90.4125]

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleInput(val: string) {
    setQuery(val)
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

  function selectSuggestion(s: Suggestion) {
    const lat = parseFloat(s.lat)
    const lng = parseFloat(s.lon)
    setSelected({ lat, lng })
    onChange({ address: s.display_name, lat, lng })
    setQuery(s.display_name)
    setOpen(false)
  }

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setSelected({ lat, lng })
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      )
      const data = await res.json()
      const addr = data.display_name || `${lat}, ${lng}`
      setQuery(addr)
      onChange({ address: addr, lat, lng })
    } catch {
      setQuery(`${lat}, ${lng}`)
      onChange({ address: `${lat}, ${lng}`, lat, lng })
    }
  }, [onChange])

  return (
    <div ref={ref} className="space-y-3">
      <div className="relative">
        {customIcon || <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />}
        <Input
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={placeholder}
          className="pl-10 h-12 bg-muted/30 pr-10"
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        ) : (
          <Crosshair className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-[9999] w-[calc(100%-2rem)] bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => selectSuggestion(s)}
              className="px-4 py-3 text-sm hover:bg-muted cursor-pointer border-b border-border last:border-0 transition-colors"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}

      <div className="h-64 md:h-80 rounded-xl overflow-hidden border border-border z-0">
        <MapContainer
          center={selected ? [selected.lat, selected.lng] : defaultCenter}
          zoom={selected ? 14 : 6}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {selected && <FlyTo lat={selected.lat} lng={selected.lng} />}
          {selected && <Marker position={[selected.lat, selected.lng]} icon={icon} />}
        </MapContainer>
      </div>
    </div>
  )
}
