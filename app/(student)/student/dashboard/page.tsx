import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Student Dashboard" };

export default async function StudentDashboard() {
  const session = await getAuthSession();
  if (!session || session.user.role !== "STUDENT") redirect("/login");

  return (
    <main id="main-content" className="p-6 animate-in">
      <h1 className="text-2xl font-bold mb-2">Welcome, {session.user.name} 👋</h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Student dashboard — Phase 2 features coming soon.
      </p>
    </main>
  );
}
