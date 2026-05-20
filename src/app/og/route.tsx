import { ImageResponse } from "next/og"

export const runtime = "edge"

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

async function loadFont(weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900): Promise<{ name: string; data: ArrayBuffer; weight: typeof weight; style: "normal" } | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`,
      { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(5000) }
    ).then((r) => r.text())
    const match = css.match(/src:\s*url\(([^)]+)\)/)
    if (!match) return null
    const data = await fetch(match[1], {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(5000),
    }).then((r) => r.arrayBuffer())
    return { name: "Inter", data, weight, style: "normal" }
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const [font400, font800] = await Promise.all([loadFont(400), loadFont(800)])
    const fonts = [font400, font800].filter((f): f is NonNullable<typeof f> => f !== null)

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "#070235",
            position: "relative",
            overflow: "hidden",
            fontFamily: fonts.length > 0 ? "Inter" : "sans-serif",
          }}
        >
          {/* Decorative gradient circles */}
          <div
            style={{
              position: "absolute",
              top: "-200px",
              right: "-100px",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,107,95,0.15) 0%, rgba(0,107,95,0) 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-150px",
              left: "-80px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,168,154,0.1) 0%, rgba(0,168,154,0) 70%)",
            }}
          />

          {/* Subtle dot pattern overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              padding: "60px 80px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Accent bar */}
            <div
              style={{
                width: "80px",
                height: "4px",
                borderRadius: "2px",
                background: "#00a89a",
                marginBottom: "32px",
              }}
            />

            {/* App name */}
            <div
              style={{
                fontSize: "96px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                textAlign: "center",
                marginBottom: "16px",
                fontFamily: fonts.length > 0 ? "Inter" : "sans-serif",
              }}
            >
              Rideio
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: "28px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.02em",
                textAlign: "center",
                marginBottom: "20px",
                fontFamily: fonts.length > 0 ? "Inter" : "sans-serif",
              }}
            >
              Community Ride Sharing in Bangladesh
            </div>

            {/* Feature badges — text only, no SVGs for reliability */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "12px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  padding: "8px 20px",
                  borderRadius: "100px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Real-time Tracking
              </div>
              <div
                style={{
                  padding: "8px 20px",
                  borderRadius: "100px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Verified Drivers
              </div>
              <div
                style={{
                  padding: "8px 20px",
                  borderRadius: "100px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Safe & Transparent
              </div>
            </div>

            {/* Bottom accent dots */}
            <div
              style={{
                position: "absolute",
                bottom: "36px",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00a89a", opacity: 0.6 }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00a89a", opacity: 0.8 }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00a89a" }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00a89a", opacity: 0.8 }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00a89a", opacity: 0.6 }} />
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fonts.length > 0 ? fonts : undefined,
      }
    )
  } catch (err) {
    console.error("OG image error:", err)
    // Return a simple fallback image if anything goes wrong
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#070235",
            color: "#ffffff",
            fontSize: "64px",
            fontWeight: 700,
          }}
        >
          Rideio
          <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.6)", marginTop: "16px" }}>
            Community Ride Sharing in Bangladesh
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}
