# 🏥 CampusCare — Hospital Visit Authorization System

> A digital solution for VIT students to request, track, and get authorized for hospital visits — with real-time emergency escalation.

---

## 🚨 The Problem

VIT students needing hospital visits go through a slow, paper-based authorization process. During emergencies or off-hours, requests sit unattended — putting students at risk.

## ✅ The Solution

**CampusCare** digitises the entire workflow:

1. **Student** submits a hospital visit request
2. **Proctor** gets notified and approves / rejects
3. If ignored for **3 minutes** → auto-escalates with SMS to parents + email to proctor
4. Approved students get a **scannable QR pass** for the hospital

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend + Backend | Next.js 14 (App Router) |
| Auth | NextAuth.js |
| Database ORM | Prisma |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS |
| Notifications | Twilio SMS (mock-mode) |
| Deployment | Vercel |

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/campuscare.git
cd campuscare

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL, NextAuth secret, and Twilio keys

# 4. Push DB schema and seed demo data
npx prisma db push
npx prisma db seed

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Student | student@vit.ac.in | demo1234 |
| Proctor | proctor@vit.ac.in | demo1234 |
| Admin | admin@vit.ac.in | demo1234 |

---

## 📁 Project Structure

```
/app
  (auth)/login/         ← Login page
  (student)/dashboard/  ← Student portal
  (proctor)/dashboard/  ← Proctor portal
  (admin)/dashboard/    ← Admin panel
  api/                  ← API Route Handlers
/lib
  actions/              ← Server Actions
  db.ts                 ← Prisma client
  auth.ts               ← NextAuth config
/components             ← Reusable UI components
/prisma
  schema.prisma         ← DB schema
```

---

## 🌐 Live Demo

> 🔗 Coming soon — will be deployed on Vercel

---

## 👥 Team

Built at **Build-a-Thon 2026**
