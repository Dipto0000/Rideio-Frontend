"use client"

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"
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

interface RideDetailMapProps {
  from: { lat: number; lng: number }
  to: { lat: number; lng: number }
}

export function RideDetailMap({ from, to }: RideDetailMapProps) {
  const center: [number, number] = [(from.lat + to.lat) / 2, (from.lng + to.lng) / 2]
  const points: [number, number][] = [[from.lat, from.lng], [to.lat, to.lng]]

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution="&copy; OSM"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[from.lat, from.lng]} icon={fromIcon} />
      <Marker position={[to.lat, to.lng]} icon={toIcon} />
      <Polyline positions={points} color="#006b5f" weight={3} dashArray="8 4" />
    </MapContainer>
  )
}
