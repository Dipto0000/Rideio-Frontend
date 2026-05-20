"use client"

import { useState, useEffect } from "react"
import { Download, Smartphone, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check localStorage to see if user dismissed it
    const isDismissed = localStorage.getItem("pwa-prompt-dismissed") === "true"
    if (isDismissed) return

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show the install promotion custom UI
      setIsVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Also handle when PWA is successfully installed
    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsVisible(false)
    }
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)

    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null)
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    // Don't show it again for this browser session/local storage
    localStorage.setItem("pwa-prompt-dismissed", "true")
  }

  if (!isVisible || !deferredPrompt) return null

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-fade-slide-up">
      <div className="relative overflow-hidden bg-card border border-border/40 rounded-2xl shadow-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 isolate">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent -z-10" />

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary shrink-0 mt-0.5 sm:mt-0">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-bold text-primary">Install Rideio App</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Add Rideio to your home screen for quick, offline-ready community ride sharing!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="h-9 px-4 text-xs font-bold bg-secondary hover:bg-secondary/90 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 w-full sm:w-auto"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Dismiss prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
