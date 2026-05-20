import sharp from "sharp"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputPath = join(__dirname, "..", "public", "og-image.png")

const WIDTH = 1200
const HEIGHT = 630

// Brand colors
const NAVY = "#070235"
const TEAL = "#00a89a"
const WHITE = "#ffffff"
const DARK_BG = "#050125"

function svgContent() {
  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradient for decorative circles -->
    <radialGradient id="g1" cx="100%" cy="0%" r="60%">
      <stop offset="0%" stop-color="${TEAL}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${TEAL}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="0%" cy="100%" r="50%">
      <stop offset="0%" stop-color="${TEAL}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${TEAL}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${NAVY}"/>

  <!-- Decorative circles -->
  <circle cx="1100" cy="-50" r="400" fill="url(#g1)"/>
  <circle cx="100" cy="700" r="350" fill="url(#g2)"/>

  <!-- Dot pattern overlay -->
  <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1" fill="${WHITE}" fill-opacity="0.04"/>
  </pattern>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)"/>

  <!-- Accent bar -->
  <rect x="560" y="140" width="80" height="4" rx="2" fill="${TEAL}"/>

  <!-- Title: Rideio -->
  <text x="600" y="280" text-anchor="middle" font-family="sans-serif" font-size="96" font-weight="800" fill="${WHITE}" letter-spacing="-3">
    Rideio
  </text>

  <!-- Tagline -->
  <text x="600" y="340" text-anchor="middle" font-family="sans-serif" font-size="28" fill="${WHITE}" fill-opacity="0.7" letter-spacing="0.5">
    Community Ride Sharing in Bangladesh
  </text>

  <!-- Feature badges -->
  <g transform="translate(430, 380)">
    <rect x="0" y="0" width="160" height="36" rx="18" fill="${WHITE}" fill-opacity="0.08" stroke="${WHITE}" stroke-opacity="0.1" stroke-width="1"/>
    <text x="80" y="24" text-anchor="middle" font-family="sans-serif" font-size="15" fill="${WHITE}" fill-opacity="0.85">Real-time Tracking</text>
  </g>
  <g transform="translate(600, 380)">
    <rect x="-80" y="0" width="160" height="36" rx="18" fill="${WHITE}" fill-opacity="0.08" stroke="${WHITE}" stroke-opacity="0.1" stroke-width="1"/>
    <text x="0" y="24" text-anchor="middle" font-family="sans-serif" font-size="15" fill="${WHITE}" fill-opacity="0.85">Verified Drivers</text>
  </g>
  <g transform="translate(770, 380)">
    <rect x="-80" y="0" width="160" height="36" rx="18" fill="${WHITE}" fill-opacity="0.08" stroke="${WHITE}" stroke-opacity="0.1" stroke-width="1"/>
    <text x="0" y="24" text-anchor="middle" font-family="sans-serif" font-size="15" fill="${WHITE}" fill-opacity="0.85">Safe &amp; Transparent</text>
  </g>

  <!-- Bottom dot indicators -->
  <circle cx="575" cy="560" r="3" fill="${TEAL}" fill-opacity="0.6"/>
  <circle cx="590" cy="560" r="3" fill="${TEAL}" fill-opacity="0.8"/>
  <circle cx="605" cy="560" r="3" fill="${TEAL}"/>
  <circle cx="620" cy="560" r="3" fill="${TEAL}" fill-opacity="0.8"/>
  <circle cx="635" cy="560" r="3" fill="${TEAL}" fill-opacity="0.6"/>
</svg>`
}

async function generate() {
  try {
    const svg = svgContent()
    await sharp(Buffer.from(svg))
      .resize(WIDTH, HEIGHT)
      .png()
      .toFile(outputPath)

    // Verify the output
    const meta = await sharp(outputPath).metadata()
    console.log(`✅ OG image generated: ${outputPath}`)
    console.log(`   Dimensions: ${meta.width} x ${meta.height}`)
    console.log(`   Format: ${meta.format}`)
    console.log(`   Size: ${meta.size} bytes`)
  } catch (err) {
    console.error("❌ Failed to generate OG image:", err)
    process.exit(1)
  }
}

generate()
