import { ImageResponse } from "next/og"

export const alt = "Rideio — Community Ride Sharing in Bangladesh"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #070235 0%, #0a0340 50%, #006b5f 100%)",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-2px",
            marginBottom: 16,
          }}
        >
          Rideio
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            opacity: 0.9,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Community Ride Sharing in Bangladesh
        </div>

        {/* Accent line */}
        <div
          style={{
            width: 80,
            height: 4,
            background: "#006b5f",
            borderRadius: 2,
            marginTop: 24,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 18,
            opacity: 0.7,
            marginTop: 16,
          }}
        >
          Find rides or start driving — safe, affordable, verified
        </div>
      </div>
    ),
    { ...size }
  )
}
