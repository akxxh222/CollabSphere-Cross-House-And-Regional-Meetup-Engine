import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const session = await getAuthSession();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return (
    <main id="main-content" className="p-6 animate-in">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p style={{ color: "var(--text-secondary)" }}>
        System overview and management — Phase 4 features coming soon.
      </p>
    </main>
  );
}
