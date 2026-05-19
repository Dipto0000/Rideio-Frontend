# Rideio — Frontend

A production-grade ride-sharing platform frontend built with Next.js 16, React 19, and TypeScript. Rideio connects riders seeking affordable transportation with drivers looking to earn — operating on a subscription model where drivers pay ৳700/month and riders ride free.

**Live Demo:** [rideio.vercel.app](https://rideio.vercel.app)

---

## Features

### For Riders
- **Create Rides** — Interactive map-based ride creation with OpenStreetMap, autocomplete search, and system-calculated fares (Haversine formula)
- **Real-time Tracking** — Track active rides with driver details, vehicle info, and status updates
- **Ride History** — Complete ride history with filtering and review capability
- **Profile Management** — Update personal info, upload profile photo, manage notification preferences

### For Drivers
- **Ride Discovery** — Browse available rides filtered by vehicle type (bike/car), with fare and distance preview
- **Subscription System** — ৳700/month subscription via SSLCommerz payment gateway to access ride acceptance
- **Active Ride Management** — Accept → Start → Complete ride flow with real-time status updates
- **Earnings Dashboard** — Track total earnings, completed rides, average rating, and today's summary
- **One-Ride-at-a-Time** — Drivers must complete current ride before accepting new ones

### For Admins
- **User Management** — View, search, and soft-delete users with role-based filtering
- **Ride Oversight** — Monitor all rides with status-based filtering and soft-delete capability
- **Subscription Management** — Review and approve payment records
- **Platform Analytics** — Total users, drivers, rides, revenue, and top-rated drivers

### Cross-Cutting
- **Role-Based Access Control** — Rider, Driver, Admin, and Super Admin roles with server-side protection
- **Real-time Notifications** — In-app notification system with read/unread status and pagination
- **Dark Mode** — Full dark mode support via next-themes
- **PWA Support** — Installable as a mobile app with offline fallback and service worker caching
- **SEO Optimized** — Dynamic metadata, OpenGraph tags, sitemap, robots.txt, and auto-generated OG images

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.x |
| **UI** | React 19, Tailwind CSS v4, Radix UI |
| **Auth** | NextAuth v4 (JWT strategy) |
| **Maps** | Leaflet + React-Leaflet, OpenStreetMap |
| **Forms** | React 19 `useActionState` + Zod validation |
| **Notifications** | Sonner (toast) |
| **PWA** | Serwist (service worker + offline support) |
| **Deployment** | Vercel |

---

## Architecture

### Rendering Strategy
- **Public pages** (Home, About, How It Works) — Static generation (`force-static`)
- **Protected pages** (Dashboard, Profile, Notifications) — Server components with `getServerSession()` + server actions for data fetching, client components for interactivity
- **Auth pages** — Server components with `<Suspense>` boundaries for `useSearchParams()` consumers
- **Route protection** — `proxy.ts` (Next.js 16 middleware) with `withAuth` for server-side auth checks

### Data Flow
```
Browser → Next.js App Router (Server Components)
  ├── proxy.ts → Auth check (session cookie)
  ├── Server Component → getServerSession() + server action → Backend API
  └── Client Component → Interactive UI (forms, buttons, maps)
```

### Project Structure
```
src/
├── app/
│   ├── (public)/          # Public pages (Home, About, How It Works)
│   ├── (protected)/       # Protected pages (Dashboard, Profile, Rides)
│   │   ├── dashboard/
│   │   │   ├── rider/     # Rider dashboard (server + client components)
│   │   │   ├── driver/    # Driver dashboard
│   │   │   └── admin/     # Admin dashboard + sub-pages
│   │   ├── create-ride/   # Ride creation with map
│   │   ├── find-rides/    # Ride discovery for drivers
│   │   ├── rides/[rideId]/ # Ride detail with map
│   │   ├── profile/       # Profile settings
│   │   ├── notifications/ # Notification center
│   │   └── subscription/  # Driver subscription + payment
│   ├── auth/              # Auth pages (login, signup, verify, reset)
│   ├── api/auth/          # NextAuth route handler
│   ├── manifest.ts        # PWA manifest
│   ├── sitemap.ts         # Dynamic sitemap
│   ├── robots.ts          # Robots.txt
│   └── opengraph-image.tsx # Auto-generated OG image
├── components/
│   ├── layout/            # Navbar, ProtectedNavbar, Footer
│   ├── modules/           # Feature components (Auth, Ride, Dashboard, Review, Notifications)
│   ├── home/              # Hero, ActivityFeed, HowItWorksTabs
│   └── ui/                # Reusable UI primitives (Button, Card, Input, Badge, etc.)
├── lib/
│   ├── actions/           # Server actions (auth, ride, profile, admin, dashboard, etc.)
│   └── auth-options.ts    # NextAuth configuration
├── schemas/               # Zod validation schemas
├── types/                 # TypeScript type definitions
└── proxy.ts               # Route protection middleware
```

---

## Key Technical Decisions

### Server Components + Client Components Split
Every protected page follows the pattern:
- `page.tsx` (Server Component) — Fetches data via `getServerSession()` + server actions, exports metadata
- `_components/PageContent.tsx` (Client Component) — Handles interactivity (buttons, forms, modals)

This eliminates loading skeletons on initial page load — users see real data immediately.

### Fare Calculation
Fares are system-calculated using the Haversine formula and fixed rates:
- **Bike:** ৳50 base + ৳15/km
- **Car:** ৳100 base + ৳50/km

No user can edit the fare — it's computed server-side and displayed as-is.

### Vehicle Type Filtering
Drivers only see rides matching their registered vehicle type (bike or car). The filter is auto-applied based on the driver's profile and cannot be overridden.

### Error Handling
- All server actions use a shared `fetchWithAuth` utility with error message sanitization
- Technical backend errors (CastError, JWT errors, validation errors) are mapped to user-friendly messages
- Error boundaries at root and protected route levels

---

## Getting Started

### Prerequisites
- Node.js 18+
- Backend server running (see backend README)

### Installation
```bash
npm install
```

### Environment Variables
Create `.env.local`:
```env
BACKEND_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

---

## Deployment

### Vercel
1. Connect your GitHub repository
2. Set environment variables:
   - `BACKEND_URL` — Your backend URL (e.g., `https://rideio-backend.onrender.com`)
   - `NEXTAUTH_URL` — Your Vercel URL (e.g., `https://rideio.vercel.app`)
   - `NEXTAUTH_SECRET` — Random string
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
3. Deploy — Vercel handles HTTPS, CDN, and edge functions automatically

---

## License

MIT
