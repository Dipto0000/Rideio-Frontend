import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientSessionWrapper from "@/app/_components/ClientSessionWrapper"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { Toaster } from "sonner"
import { PWAInstallPrompt } from "@/components/layout/PWAInstallPrompt"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
  ? process.env.NEXT_PUBLIC_APP_URL 
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "https://rideio.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Rideio — Community Ride Sharing in Bangladesh",
    template: "%s | Rideio",
  },
  description:
    "Bangladesh's community-driven ride-sharing platform. Find affordable rides or earn as a driver. Safe, verified, and transparent.",
  keywords: [
    "ride sharing",
    "Bangladesh",
    "Dhaka",
    "carpooling",
    "bike ride",
    "car ride",
    "transport",
    "affordable rides",
  ],
  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: "Rideio",
    title: "Rideio — Community Ride Sharing in Bangladesh",
    description:
      "Find affordable rides or earn as a driver across Bangladesh. Safe, verified, and transparent.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rideio — Community Ride Sharing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rideio — Community Ride Sharing in Bangladesh",
    description: "Find affordable rides or earn as a driver across Bangladesh.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-inter">
        <ThemeProvider>
          <ClientSessionWrapper>
            {children}
          </ClientSessionWrapper>
          <PWAInstallPrompt />
        </ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { zIndex: 99999 },
          }}
        />
      </body>
    </html>
  )
}
