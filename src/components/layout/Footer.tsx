import Link from "next/link"
import { Globe, Mail, MapPin, Phone } from "lucide-react"

const FOOTER_LINKS = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "mailto:hello@rideio.com" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-[#070235] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="text-2xl font-bold tracking-tight text-white">
              Rideio
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              The most reliable community-driven transport network in Bangladesh.
              Connecting riders and drivers for safer, smarter travel.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>hello@rideio.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>Available after sign up</span>
              </div>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                {
                  href: "#",
                  label: "Facebook",
                  path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                },
                {
                  href: "#",
                  label: "Twitter",
                  path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
                },
                {
                  href: "#",
                  label: "Instagram",
                  path: "M9 2h6a7 7 0 0 1 7 7v6a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7V9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5v6a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5V9a5 5 0 0 0-5-5H9zm1 4h4a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-4zm5-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2z",
                },
              ].map(({ href, label, path }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d={path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-bold tracking-wide uppercase text-white/80">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Rideio. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Made with ❤️ for Bangladesh by <a href="https://www.facebook.com/shahriar.dipto.92" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-200">Shahriar Ahmed Dipto</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
