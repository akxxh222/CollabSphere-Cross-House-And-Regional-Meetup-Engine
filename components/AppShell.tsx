"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Activity,
  LayoutDashboard,
  ClipboardList,
  Building2,
  Users,
  Bell,
  Settings,
  History,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { initials } from "./ui";
const icons = { LayoutDashboard, ClipboardList, Building2, Users, Bell, Settings, History, Plus };
type Nav = { label: string; path: string; icon: keyof typeof icons };
export function AppShell({
  user,
  children,
}: {
  user: { name: string; role: string; email: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const reduced = useReducedMotion();
  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);
  const root = `/${user.role.toLowerCase()}`;
  const nav: Nav[] = [
    { label: "Overview", path: `${root}/dashboard`, icon: "LayoutDashboard" },
    {
      label: user.role === "STUDENT" ? "My requests" : "Visit requests",
      path: `${root}/requests`,
      icon: "ClipboardList",
    },
  ];
  if (user.role === "STUDENT")
    nav.push({ label: "New request", path: `${root}/new`, icon: "Plus" });
  if (user.role !== "ADMIN")
    nav.push({ label: "Nearby hospitals", path: `${root}/hospitals`, icon: "Building2" });
  if (user.role === "ADMIN")
    nav.push(
      { label: "People & access", path: "/admin/users", icon: "Users" },
      { label: "Hospital registry", path: "/admin/hospitals", icon: "Building2" },
      { label: "Notifications", path: "/admin/notifications", icon: "Bell" },
      { label: "Activity log", path: "/admin/audit", icon: "History" },
      { label: "Settings", path: "/admin/settings", icon: "Settings" },
    );
  const current = nav.find((n) => pathname.startsWith(n.path))?.label ?? "Request details";
  return (
    <div>
      {open && (
        <button
          className="fixed inset-0 bg-black/50 z-30 mobile-only"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <aside className={`app-sidebar ${open ? "open" : ""}`} aria-label="Main navigation">
        <Link href={`${root}/dashboard`} className="brand px-3 text-white">
          <span className="brand-mark">
            <Activity size={23} />
          </span>
          CampusCare<span className="text-[#c8edaf]">.</span>
        </Link>
        <div className="px-3 mt-2 text-[10px] tracking-wider text-[#a5bdb0]">
          IIT MADRAS · STUDENT WELLBEING
        </div>
        <div className="sidebar-caption">Workspace</div>
        <nav>
          {nav.map((n) => {
            const Icon = icons[n.icon];
            const active = pathname.startsWith(n.path);
            return (
              <Link
                key={n.path}
                href={n.path}
                className={`nav-item ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={17} strokeWidth={1.7} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-8">
          <div className="rounded-xl border border-white/15 p-4 mb-5">
            <ShieldCheck size={21} className="text-[#c8edaf] mb-3" />
            <p className="text-xs font-medium text-white">Care, without the wait.</p>
            <p className="text-[11px] leading-relaxed mt-2 text-[#b1c7ba]">
              A simpler path from your campus to the care you need.
            </p>
            <Link
              href={`${root}/hospitals`}
              className={`text-[11px] text-[#c8edaf] mt-3 flex items-center gap-1 ${user.role === "ADMIN" ? "hidden" : ""}`}
            >
              Find care nearby <ArrowUpRight size={12} />
            </Link>
          </div>
          <button className="nav-item w-full" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut size={17} />
            Sign out
          </button>
          <p className="text-[9px] px-3 mt-3 text-[#a5bdb0]">CAMPUSCARE / BUILD-A-THON 2026</p>
        </div>
      </aside>
      <div className="app-content">
        <header className="app-topbar">
          <div className="flex items-center gap-3">
            <button
              className="icon-btn mobile-only"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="text-xs">
              <span className="muted desktop-only">
                Workspace <span className="mx-3 opacity-50">/</span>
              </span>
              <span className="font-medium">{current}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="desktop-only badge badge-approved">Secure workspace</span>
            <button
              className="icon-btn"
              aria-label="Toggle color theme"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {mounted && resolvedTheme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div className="h-8 border-l mx-1 desktop-only" />
            <span className="avatar">{initials(user.name)}</span>
            <div className="desktop-only">
              <p className="text-xs font-semibold">{user.name}</p>
              <p className="text-[10px] muted mt-1 capitalize">
                {user.role.toLowerCase()} workspace
              </p>
            </div>
          </div>
        </header>
        <main id="main-content" className="page-content" tabIndex={-1}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: reduced ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.16 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="px-6 pb-5 flex justify-between text-[10px] muted">
          <span>CampusCare · IIT Madras</span>
          <span>Built around your wellbeing.</span>
        </footer>
      </div>
    </div>
  );
}
