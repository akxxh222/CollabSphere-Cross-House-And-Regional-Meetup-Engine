# CollabSphere — Build-a-Thon milestones

> Cross-house and regional meetup engine for the IIT Madras online degree community

## Foundation

- [x] Next.js App Router, TypeScript, Tailwind CSS and responsive design system
- [x] Supabase PostgreSQL with Prisma migrations and deterministic demo seed
- [x] Three active roles: admin, student coordinator and student
- [x] Credentials authentication with rate limiting and approved-member checks
- [x] Public student signup with mandatory admin approval
- [x] Middleware route protection and server-side mutation authorization

## Regional community experience

- [x] Interactive map of approved regional meetups
- [x] Meetup, coworking, study-circle, workshop and social event types
- [x] City, region, venue and coordinate-based discovery
- [x] Capacity-aware registration and waitlist status
- [x] Community activity-point profile metric
- [x] Optional hospitals-near-IIT-Madras reference page with safety context

## Joint-event management

- [x] Admins can directly create and publish meetups
- [x] Student coordinators can propose meetups
- [x] Multiple coordinators and houses can co-host one event
- [x] Admin event approval and rejection queue
- [x] Proposal and approval audit records

## Proof of presence

- [x] Unique event check-in token and QR code
- [x] Registration required before check-in
- [x] Idempotent attendance verification
- [x] Transactional attendance status and activity-point award

## Quality and release

- [x] Reversible migration archives the superseded hospital workflow data
- [x] Dark mode, mobile navigation, keyboard focus and semantic controls
- [x] Loading and error boundaries for protected workspaces
- [x] Validation tests for signup and event timing
- [x] Architecture and local setup documentation
- [ ] Lighthouse audit against the final deployed URL
- [ ] Vercel production deployment and environment configuration
- [ ] Hackathon submission URL
