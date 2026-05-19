import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/how-it-works", "/auth/"],
        disallow: ["/dashboard/", "/api/", "/profile", "/notifications", "/subscription"],
      },
    ],
    sitemap: "https://rideio.com/sitemap.xml",
  }
}
