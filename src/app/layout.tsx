import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientSessionWrapper from "@/app/_components/ClientSessionWrapper"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Rideio | Community-driven Ride Sharing in Bangladesh",
  description: "The most reliable community-driven transport network in Bangladesh.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-inter">
        <ThemeProvider>
          <ClientSessionWrapper>
            {children}
          </ClientSessionWrapper>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
