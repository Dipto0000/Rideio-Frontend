import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-10 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-xl font-bold text-secondary">
          Rideio
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-primary-foreground/80">
          <Link href="/privacy" className="hover:text-secondary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-secondary transition-colors">
            Terms of Service
          </Link>
          <Link href="/safety" className="hover:text-secondary transition-colors">
            Safety Guidelines
          </Link>
          <Link href="/support" className="hover:text-secondary transition-colors">
            Support
          </Link>
        </div>
        
        <div className="text-xs text-primary-foreground/60">
          © 2024 Rideio. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
