import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import ClientSessionWrapper from "@/app/_components/ClientSessionWrapper"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Rideio | Community-driven Ride Sharing in Bangladesh",
  description: "The most reliable community-driven transport network in Bangladesh.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-inter">
        <ClientSessionWrapper>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientSessionWrapper>
      </body>
    </html>
  )
}
