import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rideio — Community Ride Sharing",
    short_name: "Rideio",
    description: "Find affordable rides or earn as a driver across Bangladesh.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fb",
    theme_color: "#070235",
    orientation: "portrait",
    categories: ["transportation", "travel"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
