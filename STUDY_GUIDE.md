# 🚗 Rideio — Interview Study Guide

> **Project:** A community-driven ride-sharing platform for Bangladesh  
> **Live Demo:** [rideio.vercel.app](https://rideio.vercel.app)  
> **Roles:** Rider, Driver, Admin, Super Admin  
> **Business Model:** Drivers pay ৳700/month subscription; riders ride free

---

## 📚 How to Study This Guide

1. **Start with the "High-Level Pitch"** — memorize the 30-second elevator pitch
2. **Read by layers each day:**
   - **Day 1:** Project Overview + Tech Stack + Architecture (layers 1-2)
   - **Day 2:** Auth System + User Roles (layer 3)
   - **Day 3:** Ride Lifecycle + Fare Calculation (layer 4)
   - **Day 4:** Subscription/Payments + Notifications (layer 5)
   - **Day 5:** Frontend Architecture + Data Flow + Error Handling (layers 6-7)
3. **Practice the Q&A** — read the questions, cover the answers, recite out loud
4. **Actually open the code** — read the key files mentioned while studying

---

## 🎯 30-Second Elevator Pitch

> *"Rideio is a community-driven ride-sharing platform for Bangladesh. Riders can find affordable bike and car rides, while drivers can earn money through a subscription model — 700 taka per month. The platform handles everything: user registration with email verification, Google OAuth, ride creation with map-based location selection, automatic fare calculation using the Haversine formula, real-time ride status tracking, SSLCommerz payment integration for subscriptions, and role-based dashboards for riders, drivers, and admins."*

---

## 1. 🏗️ Project Overview

### What is Rideio?

A **full-stack ride-sharing platform** built specifically for the Bangladeshi market. Think "Uber meets Pathao," but community-driven — drivers pay a flat monthly subscription (৳700) instead of per-ride commission.

### Who are the users?

| Role | Abilities |
|------|-----------|
| **Rider** | Create rides, track rides, leave reviews, view history |
| **Driver** | Browse available rides, accept/start/complete rides, manage subscription, view earnings |
| **Admin** | Manage users, monitor rides, approve payments, view analytics |
| **Super Admin** | Same as Admin + create other admins |

### Key Business Rules
- **Drivers pay ৳700/month** (via SSLCommerz) — must have active subscription to accept rides
- **Riders ride free** — no fees at all
- **One ride at a time for drivers** — must complete current ride before accepting new ones
- **Fares are system-calculated** — no negotiation (Haversine formula)
- **Drivers cannot cancel after accepting** — only riders can cancel (except during in-progress)
- **Drivers must use email/password** — Google OAuth is rider-only

---

## 2. 🧱 Tech Stack

### Backend

| Technology | Why / What it does |
|-----------|-------------------|
| **Node.js + Express 5** | HTTP server & routing |
| **TypeScript** | Type safety |
| **MongoDB + Mongoose 9** | NoSQL database & ODM |
| **JWT (jsonwebtoken)** | Auth — access + refresh token pair |
| **Zod v4** | Request validation schemas |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Sending emails (Gmail SMTP) |
| **Cloudinary + Multer** | File uploads (profile photos) |
| **SSLCommerz** | Bangladeshi payment gateway |
| **Helmet, CORS** | Security middleware |
| **express-rate-limit** | Rate limiting on auth routes |

**Key npm packages:** `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `zod`, `nodemailer`, `cloudinary`, `multer`, `sslcommerz-lts`, `helmet`, `cors`, `http-status-codes`

### Frontend

| Technology | Why / What it does |
|-----------|-------------------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling |
| **NextAuth v4** | Auth (JWT strategy) |
| **Leaflet + React-Leaflet** | Map UI (OpenStreetMap) |
| **Zod** | Form validation schemas |
| **Radix UI** | Accessible UI primitives (tabs, dialogs, avatars) |
| **Lucide React** | Icon library |
| **Sonner** | Toast notifications |
| **Serwist** | PWA service worker + offline support |
| **next-themes** | Dark mode toggle |
| **date-fns** | Date formatting |
| **class-variance-authority** | Component variants |
| **clsx + tailwind-merge** | Class name utilities |

---

## 3. 🏛️ Backend Architecture (Deep Dive)

### Module Pattern

Every feature follows the same **6-file structure**:

```
src/app/modules/[feature]/
├── [feature].interface.ts   # TypeScript interfaces & enums
├── [feature].model.ts       # Mongoose schema + model
├── [feature].validation.ts  # Zod validation schemas
├── [feature].service.ts     # Business logic (pure, no HTTP)
├── [feature].controller.ts  # HTTP handlers (wraps service in catchAsync)
└── [feature].route.ts       # Express routes (middleware + controller)
```

**Study the pattern!** This is the most important architectural concept. It keeps concerns separated:
- **Interface layer** — defines data shapes
- **Model layer** — database schema
- **Validation layer** — input validation
- **Service layer** — all business logic (testable without HTTP)
- **Controller layer** — HTTP glue (thin)
- **Route layer** — URL mapping + middleware

### Request Flow (memorize this)

```
Client Request
  → Express Middleware (CORS, Helmet, Cookie Parser)
  → Route Handler at /api/v1/...
    → validateRequest (Zod validation middleware)
    → checkAuth (JWT verification + role guard middleware)
    → Controller (wrapped in catchAsync)
    → Service (business logic)
    → Mongoose Model (database query)
  → sendResponse (standardized JSON response)
  → globalErrorHandler (if error, format & return)
```

### Key Backend Files to Read

| File | What to Understand |
|------|-------------------|
| `src/app.ts` | Express setup, middleware chain, route mounting |
| `src/server.ts` | MongoDB connection, server startup, graceful shutdown, seeding |
| `src/app/config/env.ts` | Environment variable validation (loadEnvVariables()) |
| `src/app/routes/index.ts` | How all module routes are aggregated |
| `src/app/middlewares/checkAuth.ts` | JWT verification, role checking, token extraction |
| `src/app/middlewares/globalErrorHandler.ts` | Error type detection & formatting |
| `src/app/utils/catchAsync.ts` | Async error wrapper (eliminates try-catch in controllers) |
| `src/app/utils/sendResponse.ts` | Standardized response format |
| `src/app/utils/distance.ts` | Haversine formula + fare calculation |
| `src/app/utils/QueryBuilder.ts` | Generic query builder (search, filter, sort, paginate) |
| `src/app/utils/usertokens.ts` | JWT token creation & refresh |
| `src/app/errorHelpers/AppError.ts` | Custom error class with statusCode |

### Database Collections

1. **User** — name, email, password (hashed), role, subRole, subscription status, notifications[], notificationSettings, driver fields (vehicleType, numberplate, licenseNumber, dob), rating fields
2. **Ride** — riderId, driverId, from/to locations, arrivalTime, vehicleType, status, systemSuggestedFare, distanceInKm, isDeleted
3. **Payment** — userId, paymentId, planType, amount, currency, status, sslcommerzTxnNo, startDate, endDate
4. **SubscriptionPlan** — name, planType, price, currency, durationDays, features[], isActive
5. **Review** — rideId, reviewerId, driverId, rating, comment

### Key Design Decisions

- **ESM modules** — uses `"type": "module"`, imports need `.js` extension
- **Soft delete** — `isDeleted` flag with Mongoose pre-hooks that auto-filter
- **Dashboard caching** — in-memory cache with 30-second TTL, invalidated on state changes
- **Rate limiting** — auth routes: 20 req/15min, registration: 5 req/hour
- **Email templates** — EJS templates (confirmEmail, forgetPassword)
- **Error sanitization** — Mongoose/JWT/Zod errors mapped to user-friendly messages

---

## 4. 🔐 Authentication System

### How It Works

1. **Registration** — user submits credentials → backend hashes password (bcryptjs) → creates user → generates JWT verification token → sends email with verification link (10min expiry) → returns user data
2. **Email Verification** — user clicks link → frontend calls `/verify-email` with token → backend verifies JWT → marks user as verified → returns access+refresh tokens (auto-login)
3. **Login** — user sends email+password → backend compares hash → checks verification + status + soft delete → generates access+refresh tokens → returns both
4. **Google OAuth** — Google login → frontend calls backend `/google-auth` → backend creates/finds user → blocks drivers from using Google → riders auto-verified
5. **Token Refresh** — when access token expires (60s buffer before), NextAuth calls `/refresh-token` with refresh token → backend generates new access token

### Token Strategy

- **Access Token** — short-lived (configurable via env), sent in Authorization header
- **Refresh Token** — long-lived, used only for getting new access tokens
- **Verification Token** — 10-minute expiry, used for email verification & password reset

### Important Auth Rules

- **Drivers cannot use Google login** — must use email/password
- **Users must verify email** before logging in (except Google users auto-verified)
- **Blocked/inactive/deleted users** get descriptive error messages (but not too descriptive)
- **Rate limiting** protects auth endpoints from brute-force

### Possible Interview Questions

> *"Why did you choose JWT over session-based auth?"*
> Answer: Stateless — no server-side session storage needed. Works well for our REST API backend hosted on Render. Access tokens are short-lived, and we use refresh tokens for seamless renewal. NextAuth handles the JWT lifecycle on the frontend.

> *"How do you handle token refresh on the frontend?"*
> Answer: NextAuth's JWT callback checks the access token expiry (decoded from the JWT payload). If it's within 60 seconds of expiry, it calls the backend `/refresh-token` endpoint. If that fails (e.g., Render cold start), it retries after 3 seconds. If still fails, it keeps the old token — the API call will fail with "JWT expired" which is a clearer error than "session not ready."

---

## 5. 🚗 Ride Lifecycle

### Status Flow (memorize this)

```
PENDING → ACCEPTED → IN_PROGRESS → COMPLETED
                              ↘ CANCELLED (rider only, before in-progress)
```

### States Explained

| Status | Meaning |
|--------|---------|
| **PENDING** | Rider created a ride. It's visible to drivers. |
| **ACCEPTED** | A driver accepted the ride. Rider gets notified. |
| **IN_PROGRESS** | Driver started the ride. Rider gets notified. |
| **COMPLETED** | Driver finished the ride. Rider can leave a review. |
| **CANCELLED** | Rider cancelled (before or during PENDING/ACCEPTED). Driver notified if one was assigned. |

### Business Rules

- **Riders create rides** — provide from/to locations (picked from map), arrival time, vehicle type (bike/car)
- **Fare is auto-calculated** — Haversine distance × rates (bike: 50 + 15/km, car: 100 + 50/km)
- **Drivers browse rides** — only see rides matching their vehicle type
- **Drivers must have subscription** — `checkSubscription` middleware verifies this
- **One active ride per driver** — cannot accept new ride while ACCEPTED or IN_PROGRESS
- **Drivers: Accept → Start → Complete** — driver controls the flow
- **Riders can cancel** — but only before IN_PROGRESS
- **Drivers cannot cancel once accepted** — enforced in service
- **Notifications are fired** on every status change (to the other party)
- **Dashboard cache is cleared** on every ride state change

### Fare Calculation Code (be ready to explain)

```typescript
// Haversine formula: distance between two GPS coordinates
const R = 6371; // Earth's radius in km
const dLat = (lat2 - lat1) * (Math.PI / 180);
const dLng = (lng2 - lng1) * (Math.PI / 180);
const a = Math.sin(dLat/2)^2 + cos(lat1) × cos(lat2) × sin(dLng/2)^2;
const c = 2 × atan2(√a, √(1-a));
const distance = R × c;

// Fare: base + per-km rate
// Bike: 50 BDT + 15/km
// Car: 100 BDT + 50/km
```

### Possible Interview Questions

> *"How does a driver accept a ride?"*
> Answer: The driver sees available rides filtered by their vehicle type. When they click accept, the frontend sends a PATCH to `/rides/:id/accept`. The backend checks: (1) driver subscription is active, (2) driver has no active ride, (3) ride is still PENDING. If all pass, it sets driverId and status to ACCEPTED, fires a notification to the rider, and clears the dashboard cache.

> *"What happens if two drivers try to accept the same ride at the same time?"*
> Answer: The second driver would get "Ride is not available" because the status is no longer PENDING after the first acceptance. This is a simple but effective race condition handling — the status check and update happen in the same request.

---

## 6. 💳 Subscription & Payments

### How It Works

1. **Driver initiates payment** → POST `/subscriptions/init` → creates Payment record (PENDING) → SSLCommerz generates gateway URL → returns URL to frontend
2. **Driver is redirected to SSLCommerz** → pays ৳700 → SSLCommerz calls back the success/fail/cancel URLs
3. **Backend validates payment** → calls SSLCommerz validation API → on success: updates Payment to SUCCESS → sets user.subscription.isSubscribed = true with 30-day expiry
4. **IPN (Instant Payment Notification)** — SSLCommerz sends server-to-server notification → backend verifies MD5 signature → processes accordingly

### Key Concepts

- **Plan seeding** — default plan (Monthly, ৳700, 30 days) is auto-created on server startup
- **Cancellation** — drivers can cancel pending payments
- **Expiry tracking** — stored in `user.subscription.expiryDate` (checked by `checkSubscription` middleware)
- **No automatic renewal** — drivers must manually subscribe each month
- **Sandbox mode** — configurable via `SSL_IS_SANDBOX` env var

### IPN Security

The backend verifies SSLCommerz IPN signatures using MD5 hashing of received parameters. This prevents fake IPN callbacks. The `verifySSLCommerzIPN` function supports both verify_key-based and fallback verification.

---

## 7. 🔔 Notification System

### Architecture

Notifications are **embedded** in the User document (array of subdocuments):

```typescript
notifications: [{
  message: string,
  rideId?: ObjectId,
  type: NotificationType,  // 14 types
  isRead: boolean,
  createdAt: Date
}]
```

### How It Works

- **`NotificationServices.pushNotification()`** — called by ride, subscription, and admin services
- Notifications are pushed to the user's `notifications` array via `$push`
- Frontend fetches via `getNotifications()` with pagination
- Users can mark individual or all notifications as read
- Users can toggle notification types on/off (14 settings)

### Notification Types

All 14 types: RIDE_ACCEPTED, RIDE_CANCELLED, RIDE_CANCELLED_BY_DRIVER, RIDE_STARTED, RIDE_COMPLETED, NEW_RIDE_AVAILABLE, SUBSCRIPTION_EXPIRING, SUBSCRIPTION_EXPIRED, NEW_USER_REGISTERED, PAYMENT_RECEIVED, RIDE_REPORTED, ADMIN_CREATED, USER_DELETED, ACCOUNT_BLOCKED

---

## 8. 🖥️ Frontend Architecture

### Route Groups

```
src/app/
├── (public)/               # Static pages (Home, About, How It Works)
│   ├── page.tsx            # Homepage
│   ├── about/page.tsx
│   └── how-it-works/page.tsx
├── (protected)/            # Requires login (checked by proxy.ts)
│   ├── dashboard/          # Rider, Driver, Admin dashboards
│   ├── create-ride/        # Map-based ride creation
│   ├── find-rides/         # Driver ride discovery
│   ├── rides/[rideId]/     # Ride details with map
│   ├── profile/            # Profile settings
│   ├── notifications/      # Notification center
│   └── subscription/       # Subscription + payment
├── auth/                   # Auth pages (login, signup, verify, reset)
└── api/auth/               # NextAuth route handler
```

### Layout Hierarchy

```
RootLayout (html, ThemeProvider, ClientSessionWrapper, Toaster)
├── PublicLayout (public pages with PublicNavbar)
├── ProtectedLayout (getServerSession → redirect if no session → ProtectedNavbar)
└── AuthLayout (auth pages)
```

### Route Protection

- **`proxy.ts`** (Next.js 16 middleware) — checks session for all protected routes
- **`(protected)/layout.tsx`** — server-side session check using `getServerSession()`, redirects to `/auth/login`
- **Admin-only routes** — checked inside each page/action

### Server Components + Client Components Split

Every protected page follows this pattern:

```
page.tsx (Server Component)
  → Calls getServerSession() for session
  → Calls server actions to fetch data
  → Exports metadata
  → Renders _components/PageContent.tsx (Client Component)
    → Handles interactivity (buttons, forms, modals, maps)
```

**Why?** Users see real data immediately on page load — no loading skeletons.

### Data Flow

```
Browser
  → Next.js App Router
    → proxy.ts (middleware — auth check)
    → Server Component → getServerSession() → access token → server action → Backend API
    → Client Component → interactive UI (forms submit to server actions)
```

### Key Frontend Files to Read

| File | What to Understand |
|------|-------------------|
| `src/app/layout.tsx` | Root layout, metadata, providers |
| `src/proxy.ts` | NextAuth middleware for route protection |
| `src/lib/auth-options.ts` | NextAuth config — providers, callbacks, JWT handling |
| `src/lib/actions/fetch-with-auth.ts` | Shared fetch utility with error sanitization |
| `src/schemas/index.ts` | Zod validation schemas (login, signup, create ride) |
| `src/types/index.ts` | TypeScript type definitions |
| `src/app/globals.css` | Global styles, CSS variables, Tailwind theme, animations |
| `src/app/(protected)/layout.tsx` | Protected route layout with session check |
| `src/app/manifest.ts` | PWA manifest |

### Design System (DESIGN.md)

- **Colors:** Deep Indigo (primary), Electric Teal (accent), off-white backgrounds
- **Typography:** Inter font family, 8px grid
- **Elevation:** 3 levels (base → cards → modals)
- **Shapes:** Rounded (8px standard), 4px for small elements
- **Components:** Buttons (primary/secondary), Input fields, Cards, Chips/Status Tags
- **Dark mode:** Full support via CSS variables + next-themes

---

## 9. 🔄 Error Handling Strategy

### Backend

All errors flow through the **globalErrorHandler** middleware. It detects error types:

| Error Type | Detection | User Message |
|-----------|-----------|-------------|
| **AppError** | `instanceof AppError` | Custom message from service |
| **ZodError** | `err.name === 'ZodError'` | Field-level validation errors |
| **CastError** | `err.name === 'CastError'` | Invalid ObjectId |
| **DuplicateKey** | `err.code === 11000` | Duplicate field |
| **ValidationError** | `err.name === 'ValidationError'` | Mongoose validation |
| **Generic Error** | `instanceof Error` | "Something went wrong" (no leak) |

### Frontend

- Server actions use `fetchWithAuth` with **error message sanitization** — backend technical errors are mapped to user-friendly messages
- Error boundary at root and protected route levels
- Toast notifications via Sonner for success/error feedback

### Why `catchAsync`?

Instead of try-catch in every controller, `catchAsync` wraps the async function and catches any error, passing it to `next(error)`. This is a cleaner pattern.

```typescript
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

---

## 10. 📋 Common Interview Questions & Answers

### General / Architecture

**Q: "What is Rideio and what problem does it solve?"**

A: Rideio is a community-driven ride-sharing platform for Bangladesh. It connects riders with drivers. The key innovation is a subscription model for drivers (৳700/month) instead of per-ride commission, making it more affordable for drivers and keeping rides cheap for passengers. It addresses the need for affordable transportation in Bangladeshi cities.

**Q: "Why did you choose this tech stack?"**

A: We chose Next.js 16 + Express 5 + MongoDB because:
- **Next.js** gives us server-side rendering for SEO (public pages) and API routes
- **Express 5** is lightweight and well-understood for REST APIs
- **MongoDB** provides flexible schemas for our polymorphic User model (rider vs driver fields)
- **TypeScript** ensures type safety across both frontend and backend
- **Tailwind CSS** allows rapid UI development with a consistent design system

**Q: "How is the backend structured?"**

A: We use a module pattern. Each feature (auth, ride, user, subscription, etc.) has its own folder with 6 files: interface (types), model (Mongoose schema), validation (Zod), service (business logic), controller (HTTP handlers), and route (middleware wiring). This keeps concerns separated and makes the codebase easy to navigate.

**Q: "How do you handle errors?"**

A: We have a global error handler middleware that catches all errors. Controllers are wrapped in a `catchAsync` helper that passes errors to the error handler. The handler detects error types (AppError, ZodError, Mongoose errors, JWT errors) and formats them into a consistent JSON response. On the frontend, we sanitize backend error messages so users never see technical jargon.

**Q: "How did you handle file uploads?"**

A: We use Multer for multipart form parsing and Cloudinary for image storage. When a user uploads a profile photo during registration, the route has `multerUpload.single('profilePicture')` middleware which handles the multipart data, then the controller extracts the Cloudinary URL from the uploaded file.

### Auth

**Q: "How does authentication work?"**

A: We use JWT with an access token and refresh token pair. Users register with email/password (or Google OAuth for riders). Passwords are hashed with bcryptjs. New users must verify their email via a link before they can log in. On the frontend, NextAuth manages the JWT lifecycle, automatically refreshing the access token before it expires.

**Q: "Why don't drivers get Google login?"**

A: Drivers need to provide vehicle information (license, number plate, vehicle type) and go through more verification. Google OAuth doesn't provide this data, so requiring email/password ensures we collect all necessary driver information during registration.

**Q: "What is the role system?"**

A: We have a two-tier role system: `role` (SUPER_ADMIN, ADMIN, USER) and `subRole` (RIDER, DRIVER). A user with role=USER can be either a RIDER or DRIVER. Admins can be either. The `checkAuth` middleware accepts variable arguments of allowed roles, so you can protect a route with `checkAuth('ADMIN', 'SUPER_ADMIN')` or `checkAuth('USER')`.

### Ride System

**Q: "How are fares calculated?"**

A: Fares are calculated server-side using the Haversine formula. We calculate the straight-line distance between pickup and drop-off GPS coordinates, then apply the rate: bike = 50 BDT base + 15/km, car = 100 BDT base + 50/km. Fares cannot be edited by users — they're system-generated and read-only.

**Q: "What's the ride lifecycle?"**

A: (Refer to the flow chart above.) PENDING → ACCEPTED → IN_PROGRESS → COMPLETED. Riders can cancel before IN_PROGRESS. Drivers cannot cancel after accepting. Notifications are sent at each transition.

**Q: "How do you prevent a driver from accepting multiple rides?"**

A: When a driver tries to accept a ride, we check if they have any existing ride with status ACCEPTED or IN_PROGRESS. If so, we reject with "Complete your current ride before accepting a new one."

**Q: "How are rides filtered for drivers?"**

A: Drivers only see rides matching their registered vehicle type. The filter is applied server-side based on the driver's profile. Drivers cannot override this filter.

**Q: "How do you handle race conditions on ride acceptance?"**

A: The status check and update happen in the same request flow. Once a ride is accepted, its status changes from PENDING to ACCEPTED. If another driver tries to accept, the status check fails because it's no longer PENDING.

### Payment/Subscription

**Q: "How does the subscription work?"**

A: Drivers pay ৳700/month via SSLCommerz (a Bangladeshi payment gateway). The backend creates a Payment record (PENDING), redirects the driver to SSLCommerz, validates the payment on callback, and activates the subscription for 30 days. The `checkSubscription` middleware verifies the driver's subscription status on ride acceptance.

**Q: "How do you secure the payment flow?"**

A: We use SSLCommerz's IPN (Instant Payment Notification) with MD5 signature verification. The backend validates the payment both on synchronous callback (success/fail URLs) and asynchronously (IPN). We also call SSLCommerz's transaction query API to verify the payment status independently.

### MongoDB

**Q: "What indexes do you have and why?"**

A: We have indexes on Ride for: `status` (filtering by status), `riderId + status` (rider dashboard queries), `driverId + status` (driver dashboard queries). These support the most common query patterns without scanning the entire collection. We also have a unique partial index on Review to prevent duplicate reviews per ride.

**Q: "How do you handle soft deletes?"**

A: Every model has an `isDeleted` boolean. Mongoose pre-hooks on `find` and `findOne` automatically filter out deleted documents. Admins can soft-delete users and rides. The payment record is also soft-deletable.

### Frontend

**Q: "How does route protection work?"**

A: Two layers: (1) Next.js middleware (`proxy.ts`) uses NextAuth's `withAuth` to check for a valid token on protected routes. (2) The `(protected)/layout.tsx` uses `getServerSession()` on the server to verify the session and redirect to login if missing. Admin routes additionally check the user's role inside the page component.

**Q: "Why do you split pages into Server Components and Client Components?"**

A: Server Components fetch data and render the initial HTML — users see real data immediately without loading spinners. Client Components handle interactivity (forms, buttons, maps, modals). This split gives us the best of both worlds: fast initial load (SSR) + rich interactivity (CSR).

**Q: "How do you handle maps?"**

A: We use Leaflet with React-Leaflet, rendering OpenStreetMap tiles. The map is a Client Component (Leaflet requires browser APIs). Users click on the map to set pickup and drop-off locations, and we display the route as a line between the two points. Autocomplete search uses OpenStreetMap's Nominatim API.

**Q: "What's the PWA setup?"**

A: We use Serwist (a modern service worker library built on Workbox). It precaches app assets, caches API responses at runtime, and provides an offline fallback page (`/offline.html`). The app can be installed as a mobile app via the PWA manifest. We also have a custom PWA install prompt component.

### DevOps / Deployment

**Q: "How is this deployed?"**

A: The frontend is deployed on **Vercel** (auto-detects Next.js, handles HTTPS/CDN/Edge). The backend is deployed on **Render** (uses `render.yaml` configuration, auto-detects Node.js). MongoDB is hosted on **MongoDB Atlas**. File uploads go to **Cloudinary**.

**Q: "How do you handle the Render cold start?"**

A: Render's free tier spins down after inactivity. When a request comes in, there's a 30-60 second delay. We handle this in the NextAuth JWT callback by retrying the token refresh after 3 seconds if the first attempt fails.

---

## 11. 🔑 Key Code Patterns to Know

### Pattern 1: Controller-Service separation

```typescript
// Controller (thin) — HTTP concerns only
const createRide = catchAsync(async (req, res) => {
  const ride = await RideServices.createRide(req.body, req.user.userId);
  sendResponse(res, { /* ... */ });
});

// Service (fat) — business logic, no HTTP
const createRide = async (payload, userId) => {
  const distance = getDistanceInKm(...);
  const fare = calculateSuggestedFare(distance, vehicleType);
  return Ride.create({ ...payload, riderId: userId, distanceInKm, systemSuggestedFare });
};
```

### Pattern 2: QueryBuilder

```typescript
const queryBuilder = new QueryBuilder(User.find(), query)
  .filter()     // Exclude special fields, apply remaining as MongoDB filter
  .search(['name', 'email'])  // Case-insensitive regex search
  .sort()       // Default: -createdAt
  .paginate()   // Default: page=1, limit=10
  .fields();    // Exclude __v
const [data, meta] = await Promise.all([
  queryBuilder.build(),
  queryBuilder.getMeta(),
]);
```

### Pattern 3: Error handling chain

```typescript
throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exists");
// → caught by catchAsync wrapper
// → forwarded to globalErrorHandler
// → detected as AppError
// → formatted into { statusCode, success, message, data: null }
```

---

## 12. 🎯 Quick Reference — By Topic

### If asked about... "Architecture"
- **Module pattern** (6 files per feature)
- **Request flow** (middleware → controller → service → model → response)
- **Server Components + Client Components split** (Next.js App Router)
- **ESM modules** (`.js` extension in imports)

### If asked about... "Authentication"
- **JWT access + refresh token pair**
- **Google OAuth** (riders only) + **credentials** (all users)
- **Email verification** (10-min JWT token, Nodemailer via Gmail SMTP)
- **NextAuth on frontend** (JWT strategy, auto-refresh)

### If asked about... "Ride System"
- **5 statuses**: PENDING → ACCEPTED → IN_PROGRESS → COMPLETED / CANCELLED
- **Haversine formula** for distance + **fixed rates** for fare
- **Driver controls**: Accept → Start → Complete
- **Subscription required** for driver actions

### If asked about... "Payments"
- **SSLCommerz** integration (Bangladesh-specific)
- **IPN signature verification** (MD5 hash)
- **Subscription model**: ৳700/month, 30-day expiry, manual renewal

### If asked about... "Data Modeling"
- **Embedded notifications** in User document
- **Soft delete** with Mongoose pre-hooks
- **Strategic indexes** for common query patterns

### If asked about... "Frontend"
- **NextAuth** with two providers (Google + Credentials)
- **Zod validation** on forms
- **Leaflet + OpenStreetMap** for maps
- **Tailwind CSS v4** with custom design system
- **Serwist PWA** with offline support

---

## 13. 📝 Final Tips for the Interview

1. **Be honest about AI usage** — "I used AI-assisted development tools to accelerate implementation, but I've thoroughly reviewed and understand every part of the codebase. Let me explain how it works..."

2. **Focus on understanding WHY** — not just what the code does, but why those decisions were made. The study guide above explains the reasoning.

3. **Use the module pattern as your anchor** — when asked about any feature, start with "It follows our standard module pattern of interface → model → validation → service → controller → route..."

4. **Draw the request flow** — if there's a whiteboard, sketch the request flow diagram. It shows you understand the full picture.

5. **Mention trade-offs** — e.g., "We chose embedded notifications over a separate collection because notifications are always fetched with the user, and the array size is bounded. But for a larger scale, we'd split it into a separate collection."

6. **The project's limitations you can acknowledge:**
   - No real-time WebSocket connection (polling-based for now)
   - Embedded notifications don't scale to millions
   - Haversine is straight-line, not road distance
   - No automatic subscription renewal
   - No SMS notifications (email only)

---

## 14. 🔍 Deep Dive: Authentication System — All Code Flows

This section walks through **every authentication flow** in the codebase with actual production code. Study these to answer detailed "how does authentication work?" questions with confidence.

All routes are defined in:

**File:** `Rideio Backend/src/app/modules/auth/auth.route.ts`

```typescript
// Auth API routes overview:
// POST /api/v1/auth/login              → credentialsLogin
// POST /api/v1/auth/google-auth        → handleGoogleAuth
// POST /api/v1/auth/register/rider     → registerRider (multipart)
// POST /api/v1/auth/register/driver    → registerDriver (multipart)
// POST /api/v1/auth/verify-email       → verifyEmail
// POST /api/v1/auth/resend-confirmation → resendConfirmation
// POST /api/v1/auth/forgot-password    → forgotPassword
// POST /api/v1/auth/reset-password     → resetPassword
// POST /api/v1/auth/refresh-token      → getNewAccessToken
// POST /api/v1/auth/change-password    → changePassword [checkAuth]
// POST /api/v1/auth/set-password       → setPassword [checkAuth]
```

---

### 14A. 📝 Credentials Registration Flow (Rider & Driver)

#### Step 1: Frontend sends registration form data

**File:** `rideio-frontend/src/lib/actions/auth.actions.ts`

```typescript
export async function registerRider(formData: FormData) {
  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/register/rider`, {
      method: "POST",
      body: formData,   // FormData includes profile picture as file
    })
    return await res.json()
  } catch {
    return { success: false, message: "Unable to connect to the server..." }
  }
}
```

The route uses `multerUpload.single('profilePicture')` to parse multipart data + Cloudinary upload.

#### Step 2: Route-level middleware processes the request

**File:** `Rideio Backend/src/app/modules/auth/auth.route.ts`

```typescript
router.post(
  "/register/rider",
  registerLimiter,          // ⏱ 5 registrations per hour
  parseFormData,            // 🖼️ Parse multipart form
  multerUpload.single('profilePicture'),  // ☁️ Upload to Cloudinary
  validateRequest(authValidation.registerRiderValidation),  // ✅ Zod validation
  AuthControllers.registerRider
);

router.post(
  "/register/driver",
  registerLimiter,          // Same rate limit for drivers
  parseFormData,
  multerUpload.single('profilePicture'),
  validateRequest(authValidation.registerDriverValidation),  // Stricter validation
  AuthControllers.registerDriver
);
```

#### Step 3: Zod validation — different rules for riders vs drivers

**File:** `Rideio Backend/src/app/modules/auth/auth.validation.ts`

```typescript
// Rider: password is OPTIONAL (allows social-only accounts to set password later)
const registerRiderValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: password.optional(),  // ← Optional for riders!
  phone: phoneOptional,
  // Role and subRole are SET BY THE ENDPOINT, not from client
});

// Driver: ALL fields required + vehicle details
const registerDriverValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password,  // ← Required for drivers
  phone: phoneRequired,
  // Driver-specific fields (all required):
  vehicleType: z.enum(["bike", "car"], "Vehicle type is required"),
  numberplate: z.string().min(1, "Vehicle license plate is required"),
  licenseNumber: z.string().min(1, "Driver license number is required"),
  dob: z.string().min(1, "Date of birth is required").refine(...),
});
```

Password rules:
```typescript
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{6,}$/;
// → at least 6 chars, at least 1 letter, at least 1 special character
```

#### Step 4: Controller extracts data (including Cloudinary URL)

**File:** `Rideio Backend/src/app/modules/auth/auth.controller.ts`

```typescript
const registerRider = catchAsync(async (req, res) => {
  const picture = getFileUrl(req.file);  // Extract Cloudinary URL from uploaded file
  const result = await AuthServices.registerWithCredentials({
    ...req.body,
    picture,
    role: "USER",       // ← Hardcoded by endpoint
    subRole: "RIDER",   // ← Hardcoded by endpoint
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Rider registered successfully. Please verify your email.",
    data: result,
  });
});
```

Key point: `role` and `subRole` are **hardcoded by the endpoint**, not taken from the client. This prevents privilege escalation attacks.

#### Step 5: Service — hash password, create user, send verification email

**File:** `Rideio Backend/src/app/modules/auth/auth.service.ts` — `registerWithCredentials`

```typescript
const registerWithCredentials = async (payload) => {
  const { email, name, password, role, subRole, vehicleType, numberplate, licenseNumber, dob } = payload;

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User already exists with this email");
  }

  // 2. Hash password with bcryptjs
  const hashedPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND));

  // 3. Build user data object
  const userData: any = {
    email, name,
    password: hashedPassword,
    role, subRole,
    isVerified: false,          // ← Must verify email before login
    status: UserStatus.ACTIVE,
    isDeleted: false,
    subscription: { isSubscribed: false },
  };

  // 4. Driver-specific fields (all required, validated by Zod)
  if (role === Role.USER && subRole === SubRole.DRIVER) {
    userData.vehicleType = vehicleType;
    userData.numberplate = numberplate;
    userData.licenseNumber = licenseNumber;
    userData.dob = new Date(dob);
  }

  // 5. Create user in database
  const user = await User.create(userData);

  // 6. Generate JWT verification token (10 min expiry)
  const verificationToken = jwt.sign(
    { userId: user._id, email: user.email },
    envVars.JWT_VERIFICATION_SECRET,
    { expiresIn: "10m" }
  );

  // 7. Store verification token on user record
  user.verificationToken = verificationToken;
  user.verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  // 8. Send verification email (non-blocking — fire & forget)
  const verifyLink = `${envVars.FRONTEND_URL}/auth/verify?token=${verificationToken}`;
  sendEmail({
    to: user.email,
    subject: "Verify Your Email - Rideio",
    templateName: "confirmEmail",
    templateData: { name: user.name, verifyLink },
  }).catch((err) => console.error("Failed to send verification email:", err?.message || err));

  // Return user data WITHOUT sensitive info
  const { password: pass, ...rest } = user.toObject();
  return { ...rest, verificationToken };
};
```

---

### 14B. 🔑 Credentials Login Flow

This is the most commonly asked about flow. Memorize the status checks in order.

#### Step 1: Frontend calls login with email + password

**File:** `rideio-frontend/src/lib/auth-options.ts` — CredentialsProvider

```typescript
CredentialsProvider({
  id: "credentials",
  name: "credentials",
  async authorize(credentials) {
    // 1. Validate input presence
    if (!credentials?.email || !credentials?.password) return null

    // 2. POST to backend /api/v1/auth/login
    const res = await fetch(`${BACKEND}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })

    const data = await res.json()
    if (!res.ok || !data.success) throw new Error(data.message || "Login failed")

    // 3. Return user object with tokens — NextAuth stores these in the JWT callback
    return {
      id: u._id || u.id,
      email: u.email,
      name: u.name,
      image: u.picture,
      accessToken: data.data.accessToken,   // ← Stored in NextAuth token
      refreshToken: data.data.refreshToken, // ← Stored in NextAuth token
      role: u.role,
      subRole: u.subRole,
      // ... more fields
    }
  },
}),
```

#### Step 2: Backend validates credentials (all checks in order)

**File:** `Rideio Backend/src/app/modules/auth/auth.service.ts` — `credentialsLogin`

```typescript
const credentialsLogin = async (payload) => {
  const { email, password } = payload;

  // 1. Find user by email (explicitly select +password since it has select: 0 in schema)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid email or password");
  }

  // 2. Check if user has a password set (might be Google-only account)
  if (!user.password) {
    throw new AppError(StatusCodes.BAD_REQUEST,
      "Please log in with Google or set a password first"
    );
  }

  // 3. Compare password hash with bcryptjs
  const isPasswordMatched = await bcryptjs.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid email or password");
  }

  // 4. 🔴 Must verify email first
  if (!user.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Please verify your email first");
  }

  // 5. Check user status
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(StatusCodes.FORBIDDEN,
      "Your account has been blocked. Please contact support."
    );
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN,
      "Your account is inactive. Please contact support."
    );
  }

  // 6. Soft-delete check
  if (user.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This account no longer exists.");
  }

  // ✅ All checks passed — generate tokens
  const userTokens = createUserTokens(
    user._id.toString(), user.email, user.role, user.subRole
  );

  // Strip password from response
  const { password: pass, ...rest } = user.toObject();

  return { accessToken: userTokens.accessToken, refreshToken: userTokens.refreshToken, user: rest };
};
```

#### Step 3: Tokens are generated

**File:** `Rideio Backend/src/app/utils/usertokens.ts`

```typescript
const createUserTokens = (userId, email, role, subRole) => {
  const jwtPayload = { userId, email, role, subRole };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES   // Short-lived (e.g. "15m")
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES  // Long-lived (e.g. "7d")
  );

  return { accessToken, refreshToken };
};
```

Both tokens carry the **same payload**: `{ userId, email, role, subRole }`. The difference is:
- **Access token**: short-lived, sent in `Authorization: Bearer <token>` header
- **Refresh token**: long-lived, used only for the `/refresh-token` endpoint

#### Step 4: Tokens are stored in the NextAuth JWT

**File:** `rideio-frontend/src/lib/auth-options.ts` — `jwt` callback

```typescript
async jwt({ token, user, account, trigger }) {
  if (user) {
    if (account?.provider !== "google") {  // ← Not Google (handled separately)
      token.id = user.id
      token.accessToken = user.accessToken
      token.refreshToken = user.refreshToken
      token.accessTokenExpires = getJwtExpiry(user.accessToken) ?? 0
      token.role = user.role
      token.subRole = user.subRole
      token.isVerified = user.isVerified
      token.isSubscribed = user.isSubscribed
      // ... more fields
    }
  }
  // ... auto-refresh logic (see 14E) ...
  return token
}
```

The `getJwtExpiry` helper decodes the JWT payload (no verification needed) to extract the `exp` field:

```typescript
function getJwtExpiry(token: string): number | null {
  const payload = token.split(".")[1]
  const decoded = JSON.parse(Buffer.from(payload, "base64").toString())
  return decoded.exp ? decoded.exp * 1000 : null  // seconds → ms
}
```

#### Step 5: Session callback makes tokens available to UI

**File:** `rideio-frontend/src/lib/auth-options.ts` — `session` callback

```typescript
async session({ session, token }) {
  session.user.id = token.id as string
  session.user.role = token.role as "USER" | "ADMIN" | "SUPER_ADMIN"
  session.user.subRole = token.subRole as "RIDER" | "DRIVER"
  session.user.accessToken = token.accessToken as string
  session.user.isVerified = token.isVerified as boolean
  session.user.isSubscribed = token.isSubscribed as boolean
  session.user.image = (token.picture as string) || null
  // ... more fields
  return session
}
```

Now, any server action or client component can read `session.user.accessToken` to make authenticated API calls.

---

### 14C. 🔵 Google Auth Flow

#### Step 1: User clicks "Sign in with Google"

NextAuth's Google provider handles the OAuth redirect. After Google returns the user's profile, NextAuth's `jwt` callback fires.

**File:** `rideio-frontend/src/lib/auth-options.ts`

```typescript
async jwt({ token, user, account, trigger }) {
  if (user) {
    if (account?.provider === "google") {
      // 🟢 Send Google profile to backend for processing
      try {
        const res = await fetch(`${BACKEND}/api/v1/auth/google-auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            picture: user.image,
            googleId: account.providerAccountId,
          }),
        })
        const data = await res.json()
        if (data.success) {
          const u = data.data.user
          // Store JWT tokens + user info in the NextAuth session
          token.accessToken = data.data.accessToken
          token.refreshToken = data.data.refreshToken
          token.role = u.role
          token.subRole = u.subRole
          token.isVerified = u.isVerified
          token.isSubscribed = u.subscription?.isSubscribed ?? false
        }
      } catch {
        /* backend unreachable — fail silently, NextAuth handles retry */ }
    }
  }
}
```

#### Step 2: Backend processes Google login

**File:** `Rideio Backend/src/app/modules/auth/auth.service.ts` — `handleGoogleAuth`

```typescript
const handleGoogleAuth = async (payload) => {
  const { email, name, googleId, picture, phone, address, dob } = payload;
  let user = await User.findOne({ email });

  if (user) {
    // 🔴 BLOCK drivers from using Google
    if (user.subRole === SubRole.DRIVER) {
      throw new AppError(StatusCodes.BAD_REQUEST,
        "Drivers must sign in with email and password. Google login is not available for driver accounts."
      );
    }
    // Link Google auth to existing email account
    const hasGoogleAuth = user.auths.some((a) => a.provider === "google");
    if (!hasGoogleAuth) {
      user.auths.push({ provider: "google", providerId: googleId });
      if (picture) user.picture = picture;
      if (!user.isVerified) user.isVerified = true;  // ✅ Auto-verify
      await user.save();
    }
  } else {
    // 🆕 New user — always created as RIDER
    user = await User.create({
      email, name, picture,
      role: Role.USER,
      subRole: SubRole.RIDER,  // ← Always RIDER, never DRIVER
      isVerified: true,        // ← Google-verified emails trusted
      auths: [{ provider: "google", providerId: googleId }],
      subscription: { isSubscribed: false },
    });
  }

  // Generate tokens same way as credentials login
  const userTokens = createUserTokens(user._id, user.email, user.role, user.subRole);
  return { accessToken: userTokens.accessToken, refreshToken: userTokens.refreshToken, user };
};
```

#### Step 3: Session callback attaches data

Same as Login Flow — the `session` callback copies from `token` to `session.user`.

---

### 14D. 📧 Email Verification Flow

This flow runs immediately after registration (Step 5 of 14A). The account is created with `isVerified: false`, and the service generates a JWT verification token and sends an email.

#### Step 1: Registration triggers verification email (back in 14A Step 5)

After user creation, the service:
1. Generates a JWT with `{ userId, email }` signed by `JWT_VERIFICATION_SECRET` (10 min expiry)
2. Stores the token on the user record (`user.verificationToken`)
3. Sends a styled HTML email via Nodemailer with a "Verify Email" button

The email link points to:
```
https://rideio.vercel.app/auth/verify?token=eyJhbGciOiJIUzI1NiJ9...
```

#### Step 2: Nodemailer sends the styled email

**File:** `Rideio Backend/src/app/utils/sendEmail.ts`

```typescript
const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_HOST,            // smtp.gmail.com
  port: Number(envVars.EMAIL_PORT),     // 587 (TLS) or 465 (SSL)
  secure: Number(envVars.EMAIL_PORT) === 465,
  auth: {
    user: envVars.GMAIL_USER,           // your.email@gmail.com
    pass: envVars.GMAIL_APP_PASSWORD,   // Gmail App Password
  },
});

const html = `
  <div style="...">
    <h1>Verify Your Email</h1>
    <p>Hello ${templateData.name},</p>
    <p>Click the button below to verify your email address and activate your account.</p>
    <div style="text-align: center;">
      <a href="${verifyLink}"
         style="display: inline-block; background: #006b5f; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
        Verify Email
      </a>
    </div>
    <p>This link expires in 10 minutes.</p>
  </div>
`;

await transporter.sendMail({
  from: `"Rideio" <${envVars.GMAIL_USER}>`,
  to, subject, html,
});
```

#### Step 3: Frontend calls the verify endpoint

**File:** `rideio-frontend/src/lib/actions/auth.actions.ts`

```typescript
export async function verifyEmail(token: string) {
  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
    return await res.json()
  } catch {
    return { success: false, message: "Unable to connect to the server." }
  }
}
```

#### Step 4: Backend verifies token and activates account

**File:** `Rideio Backend/src/app/modules/auth/auth.service.ts` — `verifyEmail`

```typescript
const verifyEmail = async (token: string) => {
  try {
    // 1. Verify the JWT signature and decode
    const decoded = jwt.verify(token, envVars.JWT_VERIFICATION_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "Invalid token");

    // 2. Idempotent: if already verified, just return tokens
    if (user.isVerified) {
      const userTokens = createUserTokens(...);
      return { message: "Email already verified", ...userTokens, user };
    }

    // 3. Mark as verified, clear stored token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // 4. Auto-login: return access + refresh tokens
    const userTokens = createUserTokens(user._id, user.email, user.role, user.subRole);
    return { message: "Email verified successfully", ...userTokens, user };

  } catch (error) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid or expired token");
  }
};
```

#### Step 5: Login is blocked until verified

In `credentialsLogin`, the verification check happens before token generation:

```typescript
if (!user.isVerified) {
  throw new AppError(StatusCodes.BAD_REQUEST, "Please verify your email first");
}
```

#### Resend Confirmation

**File:** `Rideio Backend/src/app/modules/auth/auth.service.ts` — `resendConfirmation`

For users who lost the first email:

```typescript
const resendConfirmation = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "User not found");
  if (user.isVerified) throw new AppError(StatusCodes.BAD_REQUEST, "Email already verified");

  // Generate a NEW 10-minute token (invalidates the old one)
  const verificationToken = jwt.sign(
    { userId: user._id, email: user.email },
    envVars.JWT_VERIFICATION_SECRET, { expiresIn: "10m" }
  );

  user.verificationToken = verificationToken;
  user.verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const verifyLink = `${envVars.FRONTEND_URL}/auth/verify?token=${verificationToken}`;
  sendEmail({ to: user.email, subject: "Confirm Your Email - Rideio", ... }).catch(...);

  return { message: "Confirmation email resent" };
};
```



---

### 14E. 🔄 Token Refresh Flow

This is the flow that keeps users logged in seamlessly.

#### Step 1: NextAuth checks expiry before every request

**File:** `rideio-frontend/src/lib/auth-options.ts` — inside the `jwt` callback

```typescript
// ⏰ Auto-refresh: runs on every NextAuth JWT callback invocation
if (token.accessToken && token.refreshToken) {
  const expiry = token.accessTokenExpires ?? getJwtExpiry(token.accessToken) ?? 0
  const now = Date.now()
  const bufferMs = 60 * 1000  // Refresh 60 seconds BEFORE actual expiry

  if (expiry > 0 && now > expiry - bufferMs) {
    // 1. Try to refresh
    const newAccessToken = await refreshAccessToken(token.refreshToken)

    if (newAccessToken) {
      token.accessToken = newAccessToken
      token.accessTokenExpires = getJwtExpiry(newAccessToken) ?? 0
    } else {
      // 2. Retry after 3s — handles Render cold start (~30-60s delay)
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const retryAccessToken = await refreshAccessToken(token.refreshToken)

      if (retryAccessToken) {
        token.accessToken = retryAccessToken
        token.accessTokenExpires = getJwtExpiry(retryAccessToken) ?? 0
      }
      // 3. If still fails, KEEP OLD TOKEN instead of nulling it —
      //    the API call will fail with "JWT expired" which gives a
      //    clearer error than "Session not ready"
    }
  }
}
```

#### Step 2: Frontend calls backend `/refresh-token`

```typescript
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60_000)

  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      signal: controller.signal,  // 60s timeout
    })
    const data = await res.json()
    if (!data.success) return null
    return data.data.accessToken ?? null
  } catch {
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}
```

#### Step 3: Backend verifies refresh token and issues new access token

**File:** `Rideio Backend/src/app/utils/usertokens.ts` — `createNewAccessTokenWithRefreshToken`

```typescript
const createNewAccessTokenWithRefreshToken = async (refreshToken: string): Promise<string> => {
  // Verify using the REFRESH secret (different from access secret)
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET);

  if (!verifiedRefreshToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
  }

  // Generate a NEW access token using the same payload
  const accessToken = generateToken(
    verifiedRefreshToken,                   // Reuse the decoded payload
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};
```

Key insight: The refresh token is **not consumed** — it can be used multiple times until it expires. This means the user doesn't need to re-authenticate until their refresh token expires (typically 7 days).

#### Step 4: Session update (trigger: "update")

When the user profile changes (e.g., subscription activated), the frontend calls `updateSession()` from NextAuth, which triggers the `jwt` callback with `trigger === "update"`:

```typescript
if (trigger === "update" && token.accessToken) {
  // Re-fetch user data from backend
  const res = await fetch(`${BACKEND}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  })
  const data = await res.json()
  if (data.success) {
    const u = data.data
    token.isSubscribed = u.subscription?.isSubscribed ?? token.isSubscribed
    token.phone = u.phone ?? token.phone
    token.picture = u.picture ?? token.picture
    // ... update other fields that may have changed
  }
}
```

---

### 14F. 🔐 Password Management Flow

Four operations: Forgot Password, Reset Password, Change Password, Set Password.

#### Forgot Password

**File:** `Rideio Backend/src/app/modules/auth/auth.service.ts` — `forgotPassword`

```typescript
const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");

  // Guards — same checks as login
  if (!user.isVerified)  throw new AppError(StatusCodes.BAD_REQUEST, "Please verify your email first.");
  if (user.status === UserStatus.BLOCKED) throw new AppError(StatusCodes.FORBIDDEN, "...");
  if (user.status === UserStatus.INACTIVE) throw new AppError(StatusCodes.FORBIDDEN, "...");
  if (user.isDeleted) throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");

  const resetToken = jwt.sign(
    { userId: user._id, email: user.email },
    envVars.JWT_VERIFICATION_SECRET,  // Reuses the verification secret
    { expiresIn: "10m" }
  );

  // Link includes userId so the token can be verified client-side
  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`;

  sendEmail({
    to: user.email,
    subject: "Password Reset - Rideio",
    templateName: "forgetPassword",
    templateData: { name: user.name, resetUILink },
  }).catch(...);

  return { message: "Password reset email sent" };
};
```

**Frontend action:**

```typescript
// rideio-frontend/src/lib/actions/auth.actions.ts
export async function forgotPassword(email: string) {
  const res = await fetch(`${BACKEND}/api/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  return await res.json()
}
```

#### Reset Password

**File:** `Rideio Backend/src/app/modules/auth/auth.service.ts` — `resetPassword`

```typescript
const resetPassword = async (payload: { newPassword: string; token: string }) => {
  try {
    const decoded = jwt.verify(payload.token, envVars.JWT_VERIFICATION_SECRET);
    const user = await User.findById(decoded.userId).select("+password");

    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "User not found");

    // Hash the new password and save
    const hashedPassword = await bcryptjs.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND));
    user.password = hashedPassword;
    await user.save();

    return { message: "Password reset successfully" };
  } catch (error) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid or expired token");
  }
};
```

#### Change Password (requires authentication)

**File:** `Rideio Backend/src/app/modules/auth/auth.service.ts` — `changePassword`

```typescript
const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId).select("+password");
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  // Must verify OLD password first
  const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password as string);
  if (!isOldPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old password does not match");
  }

  user.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
  await user.save();

  return { message: "Password changed successfully" };
};
```

The route is protected:

```typescript
router.post("/change-password",
  checkAuth(),  // ← Must be authenticated
  validateRequest(authValidation.changePasswordValidation),
  AuthControllers.changePassword
);
```

#### Set Password (for Google-only users)

**File:** `Rideio Backend/src/app/modules/auth/auth.service.ts` — `setPassword`

```typescript
const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  // Guard: cannot set password if already has credentials auth
  const hasCredentials = user.auths.some((auth) => auth.provider === "credentials");
  if (hasCredentials) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You have already set your password");
  }

  const hashedPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND));

  // Add the credentials provider to auths array
  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  user.password = hashedPassword;
  user.auths.push(credentialProvider);
  await user.save();

  return { message: "Password set successfully" };
};
```

This allows Google-only users to later add a password so they can also log in with email/password.

---

### 14G. 🛡️ Route Protection Flow

#### Backend: `checkAuth` middleware

**File:** `Rideio Backend/src/app/middlewares/checkAuth.ts`

```typescript
export const checkAuth = (...allowedRoles: AllowedRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      let token: string | undefined;

      // Token extraction (3 sources, tried in order):
      // 1. Authorization header: "Bearer <token>"
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) token = authHeader.split(' ')[1];

      // 2. accessToken cookie (for browser-based requests)
      if (!token) token = req.cookies?.accessToken;

      // 3. refreshToken cookie (for refresh endpoint)
      if (!token) token = req.cookies?.refreshToken;

      if (!token) throw new AppError(StatusCodes.UNAUTHORIZED, 'No token provided');

      // Verify token against access secret
      const decoded = verifyToken(token, envVars.JWT_ACCESS_SECRET);
      if (!decoded || typeof decoded === 'string') {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid token');
      }

      const user = decoded as IAuthUser;

      // Role guard: check if user's role OR subRole matches allowed roles
      if (allowedRoles.length > 0 &&
          !allowedRoles.includes(user.role as AllowedRole) &&
          !allowedRoles.includes(user.subRole as AllowedRole)) {
        throw new AppError(StatusCodes.FORBIDDEN,
          'You are not authorized to access this resource'
        );
      }

      req.user = user;  // Attach decoded user to request
      next();
    } catch (error) {
      next(error);
    }
  };
};
```

**Usage examples:**

```typescript
// Any authenticated user
checkAuth()

// Only admins
checkAuth('ADMIN', 'SUPER_ADMIN')

// Only riders (checks subRole)
checkAuth('RIDER')

// Only drivers with active subscription
checkAuth('DRIVER'), checkSubscription
```

#### Frontend: `proxy.ts` middleware

**File:** `rideio-frontend/src/proxy.ts`

```typescript
import { withAuth } from "next-auth/middleware"

const authProxy = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,  // ← Must have a valid token
  },
})

// Apply to all protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/create-ride",
    "/find-rides",
    "/rides/:path*",
    "/subscription/:path*",
  ],
}
```

#### Frontend: Protected layout (double protection)

**File:** `rideio-frontend/src/app/(protected)/layout.tsx`

```typescript
// Server-side session check — if no session, redirect to login
const session = await getServerSession(authOptions)
if (!session) redirect("/auth/login")
```

This creates **two layers of protection**:
1. `proxy.ts` blocks the HTTP request at the edge
2. `(protected)/layout.tsx` verifies the session server-side

#### How API calls carry the token

**File:** `rideio-frontend/src/lib/actions/fetch-with-auth.ts`

```typescript
export async function fetchWithAuth(path: string, accessToken: string, options = {}) {
  if (!accessToken) {
    return { success: false, message: "Please sign in to continue." }
  }

  const res = await fetch(`${BACKEND}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,   // ← Token sent here
      ...options.headers,
    },
  })

  const data = await res.json()

  // Sanitize technical errors into user-friendly messages
  if (!data.success && data.message) {
    const msg = data.message.toLowerCase()
    if (msg.includes("jwt") || msg.includes("token") || msg.includes("unauthorized")) {
      return { success: false, message: "Session expired. Please sign in again." }
    }
    if (msg.includes("casterror")) {
      return { success: false, message: "The request could not be processed..." }
    }
    // ... more sanitization
  }

  return data
}
```

---

### 14H. 🔄 Complete Auth Data Flow Diagram

Here's the **full lifecycle** of an authenticated request from page load to API call:

```
1. BROWSER: User visits /dashboard

2. EDGE: proxy.ts middleware checks for NextAuth session cookie
   └── No token → redirect to /auth/login

3. SERVER: (protected)/layout.tsx calls getServerSession()
   └── No session → redirect to /auth/login

4. SERVER: Page Server Component reads session.user.accessToken

5. SERVER: Server action calls fetchWithAuth('/api/v1/rides', accessToken)
   └── fetchWithAuth adds Authorization: Bearer <token>

6. BACKEND: checkAuth middleware:
   ├── Extracts token from Authorization header
   ├── Verifies with JWT_ACCESS_SECRET
   ├── Checks role authorization
   └── Attaches decoded user to req.user

7. BACKEND: Controller/Service processes the request
   └── Returns standardized JSON response

8. SERVER: Server action returns data → Component renders UI

9. CLIENT: User interacts → calls updateSession() if state changes
   └── JWT callback fires → checks expiry → refreshes if needed
```

---

### 📋 Auth Flow Comparison Table

| Aspect | Credentials Registration | Credentials Login | Google Auth | Email Verification | Token Refresh | Password Reset |
|--------|------------------------|-------------------|-------------|-------------------|---------------|----------------|
| **Trigger** | User submits form | User clicks "Sign In" | User clicks "Google" button | User clicks email link | Page navigation | User clicks "Forgot Password" |
| **Validation** | Zod (rider/driver variants) | Zod login schema | Zod googleAuth schema | Zod token schema | None | Zod email schema |
| **Rate limited?** | 5/hour | 20/15min | No | No | 20/15min | 20/15min |
| **Token type** | None (returns verification token) | Access + Refresh pair | Access + Refresh pair | JWT verification (10min) | New access token | JWT reset token (10min) |
| **External service** | Cloudinary (profile pic) + Nodemailer | None | Google OAuth + our backend | Nodemailer (Gmail SMTP) | None | Nodemailer |
| **Database changes** | User created (isVerified: false) | None (read-only) | User created/updated | isVerified = true | None | Password hash updated |
| **Edge cases handled** | Duplicate email | No password set, blocked/inactive/deleted, unverified | Already verified, driver blocked, linked Google auth | Already verified (idempotent) | Render cold start (3s retry) | Already verified? blocked? deleted? |

---

### 💡 Interview Talking Points for Auth Flows

**For Credentials Registration:**
> "We have two separate registration endpoints for riders and drivers. Riders can register without a password (they can add one later via `setPassword`). Drivers must provide vehicle details and are always `isVerified: false`. The `role` and `subRole` are hardcoded by the endpoint, never taken from the client — this prevents privilege escalation."

**For Credentials Login:**
> "The login function has seven ordered validation steps: user exists → has password → password matches → email verified → not blocked → not inactive → not deleted. Each check returns a specific error message. We use `bcryptjs.compare` for password verification, and the password field uses `select: 0` in the schema so it's excluded from all queries unless explicitly requested with `.select('+password')`."

**For Token Refresh:**
> "NextAuth's JWT callback runs on every request. We decode the access token's `exp` field and refresh it 60 seconds before expiry. If the backend is cold-starting (Render free tier), we retry after 3 seconds. If that also fails, we keep the old token — the API call will fail with a clear 'JWT expired' message instead of a confusing 'session not ready' error."

**For Route Protection:**
> "We use two layers of protection. The Next.js middleware (`proxy.ts`) checks for a valid NextAuth token at the edge level. The protected layout then double-checks with `getServerSession()` on the server. For role-based access, the backend `checkAuth` middleware accepts variable arguments — you can say `checkAuth('ADMIN', 'SUPER_ADMIN')` to allow only admins, or `checkAuth()` to allow any authenticated user."

---

## 15. 💳 Deep Dive: Payment Flow (SSLCommerz — End-to-End)

This is the most complex flow. It involves **5 parties**:

```
Driver clicks "Subscribe (৳700)"
  → 1. Frontend → Backend POST /subscriptions/init
  → 2. Backend returns SSLCommerz gateway URL
  → 3. Driver pays on SSLCommerz payment page
  → 4a. SUCCESS callback: SSLCommerz → Backend /subscriptions/success?tran_id=X&val_id=Y
  → 4b. IPN (server-to-server): SSLCommerz → Backend /subscriptions/ipn
  → 5. Backend validates with SSLCommerz API + activates subscription
```

### Step 1: Driver initiates payment

**File:** `Rideio Backend/src/app/modules/subscription/subscription.service.ts` — `initPayment`

```typescript
const initPayment = async (userId: string, planType: PlanType) => {
  const user = await User.findById(userId);
  const plan = await SubscriptionPlan.findOne({ planType, isActive: true });

  if (!plan) throw new AppError(StatusCodes.NOT_FOUND, "Subscription plan not found");

  // 🛑 Prevent duplicate pending payments
  const existingPending = await Payment.findOne({ userId, planType, status: PaymentStatus.PENDING });
  if (existingPending) {
    throw new AppError(StatusCodes.BAD_REQUEST,
      "You already have a pending payment. Complete or cancel it first."
    );
  }

  // Generate a unique 16-char payment ID
  const paymentId = randomUUID().replace(/-/g, "").substring(0, 16).toUpperCase();

  // Calculate dates (now → now + 30 days)
  const now = new Date();
  const endDate = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

  // 📝 Create Payment record in database (status: PENDING)
  const payment = await Payment.create({
    userId: user._id,
    paymentId,
    planType: plan.planType,
    amount: plan.price,       // 700
    currency: plan.currency,  // BDT
    status: PaymentStatus.PENDING,
    startDate: now,
    endDate,
  });

  // Prepare data for SSLCommerz API call
  const sslData: ISSLCommerzInitData = {
    total_amount: plan.price,      // 700
    currency: "BDT",
    tran_id: paymentId,            // Our unique ID (SSLCommerz uses this to correlate callbacks)
    success_url: envVars.SSL_SUCCESS_URL,
    fail_url: envVars.SSL_FAIL_URL,
    cancel_url: envVars.SSL_CANCEL_URL,
    ipn_url: envVars.SSL_IPN_URL,  // Server-to-server notification endpoint
    cus_name: user.name,
    cus_email: user.email,
    cus_phone: user.phone || "01000000000",
    cus_add1: user.address || "N/A",
  };

  // Call SSLCommerz to get a payment gateway URL
  const sslcz = new SSLCommerzPayment(
    envVars.SSL_STORE_ID,
    envVars.SSL_STORE_PASSWORD,
    envVars.SSL_IS_SANDBOX !== "true"
  );
  const apiResponse = await sslcz.init(sslData);

  if (!apiResponse?.GatewayPageURL) {
    throw new AppError(StatusCodes.BAD_GATEWAY, "Failed to initiate payment gateway");
  }

  // Return the URL — frontend redirects the driver here
  return {
    gatewayUrl: apiResponse.GatewayPageURL,
    paymentId, amount: plan.price, currency: plan.currency,
  };
};
```

### Step 2: Driver pays on SSLCommerz

The frontend receives `gatewayUrl` and redirects the driver to it.

### Step 3a: SSLCommerz calls back on success (synchronous)

**File:** `Rideio Backend/src/app/modules/subscription/subscription.service.ts` — `handleSuccess`

```typescript
const handleSuccess = async (data: Record<string, string>) => {
  const { val_id, tran_id, status } = data;
  const payment = await Payment.findOne({ paymentId: tran_id });

  if (payment.status === PaymentStatus.SUCCESS) {
    return { message: "Payment already processed", payment };  // Idempotent
  }

  // 🔐 VALIDATE with SSLCommerz before accepting anything
  if (val_id) {
    const sslcz = getSSLCommerzInstance();
    const validationResult = await sslcz.validate({
      val_id,
      store_id: envVars.SSL_STORE_ID,
      store_passwd: envVars.SSL_STORE_PASSWORD,
    });

    if (!validationResult || validationResult.status !== "VALID") {
      payment.status = PaymentStatus.FAILED;
      await payment.save();
      throw new AppError(StatusCodes.BAD_GATEWAY, "Payment validation failed");
    }
  }

  // ✅ Mark payment as successful
  payment.status = PaymentStatus.SUCCESS;
  payment.sslcommerzTxnNo = validationResult.tran_id;
  payment.valId = val_id;
  await payment.save();

  // ✅ Activate the driver's subscription (30 days from now)
  await User.findByIdAndUpdate(payment.userId, {
    "subscription.isSubscribed": true,
    "subscription.expiryDate": payment.endDate,
  });

  return { message: "Payment successful", payment };
};
```

### Step 3b: IPN (server-to-server, asynchronous)

SSLCommerz also sends a server-to-server POST to the IPN URL. This runs in parallel with the success callback.

**File:** `Rideio Backend/src/app/modules/subscription/subscription.service.ts` — `handleIPN`

```typescript
const handleIPN = async (data: Record<string, string>) => {
  // 🔐 STEP 1: Verify the IPN signature (prevents fake callbacks)
  if (!verifySSLCommerzIPN(data)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid IPN signature");
  }

  const { tran_id, status } = data;
  const payment = await Payment.findOne({ paymentId: tran_id });

  if (payment.status !== PaymentStatus.PENDING) {
    return { message: "Payment already processed", payment };  // Idempotent
  }

  if (status === "VALID" || status === "VALIDATED") {
    // Double-check by querying SSLCommerz transaction API
    const sslcz = getSSLCommerzInstance();
    const queryResult = await sslcz.transactionQueryByTransactionId({ tran_id });

    if (queryResult?.result?.status === "VALID") {
      payment.status = PaymentStatus.SUCCESS;
      await payment.save();
      await User.findByIdAndUpdate(payment.userId, {
        "subscription.isSubscribed": true,
        "subscription.expiryDate": payment.endDate,
      });
    }
  }
};
```

### IPN Signature Verification (security details)

**File:** `Rideio Backend/src/app/modules/subscription/subscription.service.ts` — `verifySSLCommerzIPN`

```typescript
const verifySSLCommerzIPN = (ipnData: Record<string, string>): boolean => {
  const receivedHash = ipnData.hash || ipnData.verify_sign;
  if (!receivedHash) return false;

  const verifyKey = ipnData.verify_key;

  if (!verifyKey) {
    // Fallback: build string from common parameters
    const verificationString =
      `store_id=${envVars.SSL_STORE_ID}` +
      `&store_passwd=${envVars.SSL_STORE_PASSWORD}` +
      `&tran_id=${ipnData.tran_id || ''}` +
      `&amount=${ipnData.amount || ''}` +
      `&currency=${ipnData.currency || ''}` +
      `&status=${ipnData.status || ''}` +
      `&val_id=${ipnData.val_id || ''}` +
      `&risk_score=${ipnData.risk_score || ''}`;

    const hash = createHash('md5').update(verificationString).digest('hex');
    return hash.toLowerCase() === receivedHash.toLowerCase();
  }

  // If verify_key is provided, use only the keys it specifies
  const keys = verifyKey.split(',').map(key => key.trim());
  let verificationString = `store_id=${envVars.SSL_STORE_ID}`;
  verificationString += `&store_passwd=${envVars.SSL_STORE_PASSWORD}`;

  for (const key of [...keys].sort()) {
    if (ipnData[key] !== undefined) {
      verificationString += `&${key}=${ipnData[key]}`;
    }
  }

  const hash = createHash('md5').update(verificationString).digest('hex');
  return hash.toLowerCase() === receivedHash.toLowerCase();
};
```

### Step 4: Subscription middleware protects driver actions

**File:** `Rideio Backend/src/app/middlewares/checkSubscription.ts`

```typescript
export const checkSubscription = async (req, _res, next) => {
  const driverId = req.user?.userId;
  const subRole = req.user?.subRole;

  // 1. Must be authenticated
  if (!driverId) return next(new AppError(StatusCodes.UNAUTHORIZED, "Authentication required"));

  // 2. Must be a DRIVER
  if (subRole !== SubRole.DRIVER) {
    return next(new AppError(StatusCodes.FORBIDDEN, "Only drivers can access this resource"));
  }

  const user = await User.findById(driverId).select("subscription");

  // 3. Must have active subscription
  if (!user?.subscription?.isSubscribed) {
    return next(new AppError(StatusCodes.FORBIDDEN, "Subscription required"));
  }

  // 4. Must not be expired
  if (user.subscription.expiryDate && user.subscription.expiryDate < new Date()) {
    return next(new AppError(StatusCodes.FORBIDDEN, "Subscription expired. Please renew."));
  }

  next();  // ✅ All checks passed
};
```

Applied to driver routes:

```typescript
router.patch("/:id/accept",   checkAuth(), checkSubscription, RideController.acceptRide);
router.patch("/:id/start",    checkAuth(), checkSubscription, RideController.startRide);
router.patch("/:id/complete", checkAuth(), checkSubscription, RideController.completeRide);
```

---

### 💡 Interview Talking Points for Payment Flow

> "The trickiest part was the dual callback system. SSLCommerz sends both a synchronous redirect (success URL) and an asynchronous IPN. Both must be handled idempotently — if one processes the payment before the other, the second should skip silently. We also verify the IPN signature using MD5 hashing and double-check by querying SSLCommerz's transaction API."
