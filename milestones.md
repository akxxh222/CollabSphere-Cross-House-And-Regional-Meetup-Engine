# CampusCare — Build-a-Thon milestones

> Hospital Visit Authorization & Emergency Escalation for IIT Madras
> Next.js 15 App Router · Prisma · Supabase PostgreSQL · NextAuth · Vercel

Updated from verified repository state on 17 October 2026. A checked item exists in code; external release items remain open until their result can be verified.

## Scoring rubric

| Criterion              | Weight | Evidence                                                                                      |
| ---------------------- | -----: | --------------------------------------------------------------------------------------------- |
| Technical architecture |    30% | Server-first App Router, transactional domain services, scoped authorization, idempotent jobs |
| Real-world utility     |    30% | Student → proctor → parent workflow, emergency escalation, QR pass, audit history             |
| UI/UX and performance  |    20% | Responsive role workspaces, dark mode, a11y primitives, streaming states                      |
| Admin workflows        |    20% | Analytics, filtering, bulk action, registry, people, logs, settings                           |

## Phase 1 — Foundation and architecture

- [x] **1.1** Next.js App Router with TypeScript and Tailwind CSS
- [x] **1.2** Prisma with Supabase PostgreSQL
- [x] **1.3** User, Request, Notification, AuditLog, Hospital, Settings, and rate-limit models
- [x] **1.4** Credentials authentication and role-bearing JWT sessions
- [x] **1.5** Auth, student, proctor, parent, and admin route groups
- [x] **1.6** Middleware role protection plus server-side record authorization
- [x] **1.7** Server Actions backed by domain services
- [x] **1.8** Documented environment configuration and local secret generator
- [x] **1.9** TanStack Query for live request data and cache invalidation
- [x] **1.10** Shared Zod validation on client and server boundaries

## Phase 2 — Core utility

- [x] **2.1** Student visit submission with hospital, timing, reason, and emergency priority
- [x] **2.2** Proctor approve, reject, and escalate actions with comments
- [x] **2.3** Idempotent deadline escalation job and protected endpoint
- [x] **2.4** Twilio SMS and Resend email with safe mock modes and notification outbox
- [x] **2.5** IIT Madras-area hospital directory with provenance and approximate distance
- [x] **2.6** Transactional timeline and actor audit records
- [x] **2.7** Printable QR pass with privacy-preserving public verification
- [x] **2.8** Role-scoped, filter-aware CSV export with formula-injection protection

## Phase 3 — UI/UX and performance

- [x] **3.1** CSS design tokens for colour, surface, spacing, radius, and shadow
- [x] **3.2** Inter and Outfit through `next/font`
- [x] **3.3** System-aware dark mode and toggle
- [x] **3.4** Dashboard surface and restrained glass treatment
- [x] **3.5** Reduced-motion-aware route transitions
- [x] **3.6** Responsive layouts from 375px through desktop
- [x] **3.7** Named controls, semantic tables, dialogs, and keyboard focus
- [x] **3.8** Accessible contrast palette; automated axe checks included
- [x] **3.9** Skip-to-content link in root layout
- [x] **3.10** Associated labels for form controls
- [ ] **3.11** Lighthouse ≥90 — measure on the final deployed URL
- [x] **3.12** `next/image` for generated QR image rendering; no decorative raster assets
- [x] **3.13** Loading UI at every protected role segment
- [x] **3.14** Friendly error UI at every protected role segment
- [x] **3.15** Server Components for read-only pages and query views
- [x] **3.16** Accessible status badges
- [x] **3.17** Sonner success, error, and warning toasts
- [x] **3.18** Dashboard and table skeletons
- [x] **3.19** Shared illustrated empty state
- [x] **3.20** Emergency countdown with final-minute pulse
- [x] **3.21** Actor and timestamp request timeline

## Phase 4 — Admin workflows

- [x] **4.1** Admin layout and sidebar navigation
- [x] **4.2** Total, approval-rate, response-time, and emergency KPIs
- [x] **4.3** Seven-day Recharts request trend
- [x] **4.4** Sort, search, status/date filters, and pagination
- [x] **4.5** Bulk approve, reject, and escalate with partial-failure reporting
- [x] **4.6** Add, edit, deactivate, and assign users
- [x] **4.7** Add, edit, and archive hospitals while preserving history
- [x] **4.8** Notification channel, message, status, provider ID, and failure logs
- [x] **4.9** Escalation deadline and notification templates with preview
- [x] **4.10** Filtered date-range CSV export
- [x] **4.11** Searchable administrative activity log

## Phase 5 — Quality and release

- [x] **5.1** ESLint and Prettier configuration
- [x] **5.2** TypeScript strict mode
- [x] **5.3** Shared public error mapping and HTTP status handling
- [x] **5.4** Indexed, documented Prisma relations and migration history
- [x] **5.5** README with problem, setup, environment, architecture, and deployment
- [x] **5.6** Mermaid system and lifecycle diagrams
- [x] **5.7** Contributor and security documentation
- [x] **5.8** Incremental feature commits pushed to GitHub
- [ ] **5.9** Production Vercel deployment — account connection required
- [x] **5.10** Supabase connected, migrated, and seeded with fictional demo data
- [ ] **5.11** Production variables in Vercel — requires project access
- [ ] **5.12** Verified live URL and hackathon submission

## Verification gate

- [x] Domain unit tests cover transitions, deadlines, validation, templates, and safe CSV cells
- [x] Production build completes
- [x] Strict type check completes sequentially after build generation
- [x] ESLint reports zero warnings and errors
- [x] Browser suite: all 8 four-role, access-control, mobile, and axe workflows pass
- [x] Production dependency audit: zero known vulnerabilities after patched Next.js update
- [ ] Lighthouse: run against production with real caching and transport

## Release constraint

A three-minute escalation policy requires a scheduler that invokes `/api/jobs/escalate` at least once per minute with `CRON_SECRET`. Vercel Hobby cron cannot meet this guarantee; use Vercel Pro cron or another trusted scheduler. The local demo worker polls every 15 seconds.
