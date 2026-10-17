"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Map,
  CalendarPlus,
  Users,
  Building2,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Network,
  QrCode,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { initials } from "./ui";
const icons = { LayoutDashboard, Map, CalendarPlus, Users, Building2, QrCode };
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
    { label: "Community pulse", path: `${root}/dashboard`, icon: "LayoutDashboard" },
    { label: "Explore map", path: `${root}/map`, icon: "Map" },
    { label: "Meetups", path: `${root}/events`, icon: "Users" },
  ];
  if (user.role !== "STUDENT")
    nav.push({ label: "Create meetup", path: `${root}/events/new`, icon: "CalendarPlus" });
  if (user.role === "ADMIN")
    nav.push({ label: "Member approvals", path: "/admin/members", icon: "Users" });
  nav.push({ label: "Nearby hospitals", path: `${root}/hospitals`, icon: "Building2" });
  const current = nav.find((n) => pathname.startsWith(n.path))?.label ?? "Community";
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
            <Network size={23} />
          </span>
          CollabSphere<span className="text-[#c8edaf]">.</span>
        </Link>
        <div className="px-3 mt-2 text-[10px] tracking-wider text-[#a5bdb0]">
          IIT MADRAS · ONLINE DEGREE COMMUNITY
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
                <Icon size={17} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-8">
          <div className="rounded-xl border border-white/15 p-4 mb-5">
            <Sparkles size={21} className="text-[#c8edaf] mb-3" />
            <p className="text-xs font-medium text-white">Learn locally. Belong globally.</p>
            <p className="text-[11px] leading-relaxed mt-2 text-[#b1c7ba]">
              Find peers, host study circles, and earn activity points through verified
              participation.
            </p>
          </div>
          <button className="nav-item w-full" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>
      <div className="app-content">
        <header className="app-topbar">
          <div className="flex items-center gap-3">
            <button
              className="icon-btn mobile-only"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="text-xs font-medium">{current}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="icon-btn"
              aria-label="Toggle color theme"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {mounted && resolvedTheme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <span className="avatar">{initials(user.name)}</span>
            <div className="desktop-only">
              <p className="text-xs font-semibold">{user.name}</p>
              <p className="text-[10px] muted mt-1">
                {user.role === "COORDINATOR" ? "Student coordinator" : user.role.toLowerCase()}
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
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="px-6 pb-5 flex justify-between text-[10px] muted">
          <span>CollabSphere · IIT Madras</span>
          <span>Regional learning, connected.</span>
        </footer>
      </div>
    </div>
  );
}
