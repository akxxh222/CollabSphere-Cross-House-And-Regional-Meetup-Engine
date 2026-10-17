# 🏗️ Build-a-Thon — Project Milestones

> **Project**: Campus Hospital Visit Authorization & Emergency Escalation System
> **Stack**: Next.js 14 (App Router) · Prisma · Supabase PostgreSQL · NextAuth.js · Vercel

---

## 📊 Grading Rubric Summary

| Criterion | Weight | Key Focus |
|---|---|---|
| Technical Architecture | **30%** | Sound design, clean code, APIs, state management, **Next.js App Router = extra credit** |
| Relevance & Real-World Utility | **30%** | Addresses real community problem, clean & modular code, easy to deploy |
| UI/UX & Performance | **20%** | Mobile responsive, fast, a11y (WCAG), intuitive navigation |
| Admin Usability & Workflows | **20%** | Intuitive admin dashboard, easy data management |

---

## 🏛️ Architecture Overview

```
Next.js 14 (App Router) — Full-Stack, Single Repo
├── /app
│   ├── (auth)/login/             ← Login page
│   ├── (student)/dashboard/      ← Student portal
│   ├── (proctor)/dashboard/      ← Proctor portal
│   ├── (admin)/dashboard/        ← Admin panel
│   └── api/                      ← REST Route Handlers (where needed)
│       ├── auth/[...nextauth]/   ← NextAuth.js
│       ├── requests/             ← CRUD for requests
│       └── notifications/        ← Trigger SMS/email
├── /lib
│   ├── db.ts                     ← Prisma client singleton
│   ├── auth.ts                   ← NextAuth config + role helpers
│   └── actions/                  ← Server Actions (approve, reject, escalate)
├── /components                   ← Reusable UI components
├── /prisma
│   └── schema.prisma             ← DB schema (User, Request, Notification, AuditLog)
└── .env.local                    ← Supabase URL, NextAuth secret, Twilio keys

Deployment: Vercel (one-click, full-stack)
Database:   Supabase PostgreSQL
Auth:       NextAuth.js (replaces JWT + NestJS guards)
```

---

## 🚀 Phase 1 — Project Foundation & Architecture

> **Goal**: Establish a clean, scalable full-stack Next.js architecture that maximises Technical Architecture points.

### Milestones

- [ ] **1.1** Scaffold Next.js 14 with **App Router** (`npx create-next-app@latest --app --ts --tailwind`)
- [ ] **1.2** Set up **Prisma** with Supabase PostgreSQL connection string
- [ ] **1.3** Define Prisma schema — `User`, `Request`, `Notification`, `AuditLog`
- [ ] **1.4** Configure **NextAuth.js** with Credentials provider + role-based session (`STUDENT`, `PROCTOR`, `ADMIN`, `PARENT`)
- [ ] **1.5** Create route group folders: `(auth)`, `(student)`, `(proctor)`, `(admin)`
- [ ] **1.6** Add middleware (`middleware.ts`) for role-based route protection
- [ ] **1.7** Set up `/lib/actions/` for Server Actions (approve, reject, escalate, submit)
- [ ] **1.8** Configure `.env.local` and `.env.example` with all required variables documented
- [ ] **1.9** Add **React Query (TanStack Query)** for client-side data fetching and caching
- [ ] **1.10** Add **Zod** for shared form validation schemas (used on both Server Actions + client)

### Tech Stack Decisions
| Need | Solution |
|---|---|
| Auth & sessions | NextAuth.js |
| Database access | Prisma ORM |
| Server mutations | Server Actions (`/lib/actions/`) |
| Client data fetching | TanStack Query |
| Validation | Zod |
| Styling | Tailwind CSS + CSS Variables |
| Deployment | Vercel (zero config for Next.js) |

---

## 🌍 Phase 2 — Real-World Utility & Core Features

> **Goal**: Demonstrate a compelling, real community problem solved end-to-end.

### Problem Statement (for README)
> IITM students visiting hospitals must go through a manual, paper-based authorization process involving their proctor. Emergencies during off-hours can go unnoticed for hours. This system digitises and automates the entire workflow with real-time escalation — replacing paperwork with a scannable QR pass.

### Core Feature Milestones

- [ ] **2.1** Student portal: Submit hospital visit request (reason, hospital, timing, emergency flag)
- [ ] **2.2** Proctor portal: Approve / Reject / Escalate requests with comments
- [ ] **2.3** Emergency escalation engine: Auto-escalate after **3 minutes** of pending — SMS to parents + email to proctor (mock-mode for demo)
- [ ] **2.4** Parent notification: Twilio SMS (mock-mode toggle via env variable)
- [ ] **2.5** Nearby hospitals list near VIT campus with address + distance
- [ ] **2.6** **Request timeline / audit log**: Every status change logged with timestamp + actor name
- [ ] **2.7** **QR Code pass**: Approved requests generate a scannable QR code (using `qrcode` npm package)
- [ ] **2.8** Export requests as CSV (for institutional reporting)

### API Route Handlers (`/app/api/`)

```
GET  /api/requests              ← List requests (filtered by role)
POST /api/requests              ← Submit new request
PATCH /api/requests/[id]        ← Approve / Reject / Escalate
GET  /api/requests/[id]/qr      ← Generate QR pass
POST /api/notifications/trigger ← Send SMS/email
GET  /api/admin/stats           ← Analytics data
```

### Server Actions (`/lib/actions/`)
```
submitRequest()     ← Student submits
approveRequest()    ← Proctor approves
rejectRequest()     ← Proctor rejects
escalateRequest()   ← Manual or auto escalation
```

---

## 🎨 Phase 3 — UI/UX & Performance Excellence

> **Goal**: Score maximum points on UI/UX & Performance (20%).

### Design System

- [ ] **3.1** Design token system using **CSS variables** in `globals.css` (colors, spacing, radius, shadows)
- [ ] **3.2** Google Fonts: `Inter` for body text, `Outfit` for headings (via `next/font/google`)
- [ ] **3.3** **Dark mode** via `next-themes` with system preference detection + toggle button
- [ ] **3.4** Glassmorphism card style for dashboards (`backdrop-filter: blur`, semi-transparent bg)
- [ ] **3.5** Smooth page transitions using `framer-motion` `AnimatePresence`

### Responsiveness & Accessibility (a11y)

- [ ] **3.6** Mobile-first responsive layout — all views work from 375px to 1440px
- [ ] **3.7** All interactive elements have `aria-label`, `role`, keyboard navigation (Tab + Enter/Space)
- [ ] **3.8** Colour contrast ratio >= 4.5:1 for all text (WCAG AA)
- [ ] **3.9** `<SkipToContent />` link as first focusable element on every page
- [ ] **3.10** All form `<input>` elements have a proper associated `<label>`

### Performance

- [ ] **3.11** Lighthouse score >= 90 on Performance, Accessibility, Best Practices, SEO
- [ ] **3.12** Use `next/image` for all images (WebP + lazy loading auto-handled)
- [ ] **3.13** Add `loading.tsx` **per route segment** (App Router streaming + Suspense)
- [ ] **3.14** Add `error.tsx` per route segment with friendly error UI
- [ ] **3.15** Use Server Components for all read-only data views (zero client JS for those pages)

### UI Components Checklist

- [ ] **3.16** `<StatusBadge />` — colour-coded: Pending=amber, Approved=green, Rejected=red, Escalated=purple
- [ ] **3.17** `<Toast />` notification system (success, error, warning, info) — use `sonner` or `react-hot-toast`
- [ ] **3.18** `<Skeleton />` loaders for all data-fetching states (tables, cards, stats)
- [ ] **3.19** Empty state component with illustration for zero-data views
- [ ] **3.20** Animated **escalation countdown timer** (shows time left before auto-escalation, pulses red at <60s)
- [ ] **3.21** `<RequestTimeline />` — vertical timeline with status steps and timestamps

---

## 🛠️ Phase 4 — Admin Dashboard & Workflows

> **Goal**: Score maximum points on Admin Usability & Workflows (20%).

### Admin Dashboard Milestones

- [ ] **4.1** Separate `(admin)` route group with its own layout and sidebar navigation
- [ ] **4.2** **KPI overview cards**: Total requests, approval rate, avg. response time, active emergencies
- [ ] **4.3** **Analytics chart** (Recharts): Weekly request volume + approval/rejection trend
- [ ] **4.4** **Requests data table**: Sortable columns, filter by date/status/student/proctor, pagination
- [ ] **4.5** Bulk actions: Select multiple rows → Approve / Reject / Escalate all at once
- [ ] **4.6** **User management table**: Add / Edit / Deactivate students, proctors, parents
- [ ] **4.7** **Hospital registry**: Admin can add, edit, remove hospitals in the system
- [ ] **4.8** **Notification logs table**: Every SMS/email sent with delivery status + timestamp
- [ ] **4.9** **System settings panel**: Configure escalation timeout (default 3 min), notification templates
- [ ] **4.10** Export filtered requests to CSV with date-range picker
- [ ] **4.11** Admin activity audit log (who changed what, when)

---

## ✅ Phase 5 — Quality Assurance & Deployment

> **Goal**: Clean, documented, one-click deployable project.

### Code Quality

- [ ] **5.1** ESLint + Prettier configured — zero warnings on `npm run lint`
- [ ] **5.2** TypeScript strict mode (`"strict": true` in `tsconfig.json`)
- [ ] **5.3** All Server Actions and Route Handlers have proper error handling + HTTP status codes
- [ ] **5.4** Prisma schema has proper indexes and relations documented with comments

### Documentation

- [ ] **5.5** `README.md`: Problem statement, architecture diagram, setup guide, env variables table, screenshots, live demo link
- [ ] **5.6** Mermaid architecture diagram embedded in README
- [ ] **5.7** `CONTRIBUTING.md` with local dev setup instructions

### Deployment

- [ ] **5.8** Push to GitHub (public repo)
- [ ] **5.9** Deploy to **Vercel** — single `vercel deploy` command
- [ ] **5.10** Supabase PostgreSQL connected and seeded with demo data
- [ ] **5.11** All env variables set in Vercel dashboard
- [ ] **5.12** Live demo URL in README + submitted to hackathon portal

---

## 🎯 Quick Win Checklist (High Impact, Low Effort)

| # | Task | Time | Impacts |
|---|---|---|---|
| QW-1 | Add `loading.tsx` + `error.tsx` per route | 20 min | UI/UX (20%) |
| QW-2 | Add skeleton loaders to all tables | 30 min | UI/UX (20%) |
| QW-3 | Animate the escalation countdown timer | 45 min | UI/UX (20%) |
| QW-4 | Add KPI analytics cards to admin dashboard | 45 min | Admin (20%) |
| QW-5 | Add `aria-label` to all buttons and icons | 30 min | UI/UX a11y (20%) |
| QW-6 | Add request audit timeline component | 1 hr | Relevance (30%) |
| QW-7 | QR code pass generation on approval | 1 hr | Relevance (30%) |
| QW-8 | Seed DB with realistic demo data | 30 min | All criteria |
| QW-9 | Run Lighthouse + fix issues to reach 90+ | 1 hr | UI/UX (20%) |

---

## 📅 Suggested Timeline

```
Day 1 AM  — Phase 1: Next.js scaffold, Prisma, NextAuth, route groups
Day 1 PM  — Phase 2: Core features (submit, approve, reject, escalation)
Day 2 AM  — Phase 3: Design system, dark mode, a11y, loading/error states
Day 2 PM  — Phase 4: Admin dashboard (KPIs, charts, tables, settings)
Day 3 AM  — Phase 5: QA, README, seed data, deploy to Vercel
Day 3 PM  — Polish, Lighthouse audit, QR pass, countdown timer, demo prep
```

---

## 🏆 Score Maximisation Strategy

### Technical Architecture (30%)
- [ ] Next.js App Router used deeply (route groups, layouts, Server Components, Server Actions)
- [ ] Prisma + Supabase — professional DB layer
- [ ] TanStack Query for client state, Zod for validation
- [ ] Middleware for role-based auth guards
- [ ] Clean `/lib/actions/` abstraction layer

### Relevance & Real-World Utility (30%)
- [ ] Solves a real IITM campus problem (hospital authorization)
- [ ] Full end-to-end workflow: Student → Proctor → Parent notification
- [ ] QR pass generation = genuinely deployable at a real institution
- [ ] One-click Vercel deployment = easy adoption

### UI/UX & Performance (20%)
- [ ] Lighthouse >= 90 on all metrics
- [ ] Mobile-first, dark mode, WCAG AA a11y
- [ ] Skeleton loaders + micro-animations + transitions
- [ ] `loading.tsx` / `error.tsx` per route

### Admin Usability & Workflows (20%)
- [ ] KPI cards + Recharts analytics chart
- [ ] Sortable, filterable data table with bulk actions
- [ ] User management + hospital registry
- [ ] System settings panel
