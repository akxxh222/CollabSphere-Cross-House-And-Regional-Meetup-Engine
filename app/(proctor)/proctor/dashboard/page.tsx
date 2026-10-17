import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Proctor Dashboard" };

export default async function ProctorDashboard() {
  const session = await getAuthSession();
  if (!session || (session.user.role !== "PROCTOR" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  return (
    <main id="main-content" className="p-6 animate-in">
      <h1 className="text-2xl font-bold mb-2">Proctor Dashboard</h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Manage student hospital visit requests — Phase 2 features coming soon.
      </p>
    </main>
  );
}
