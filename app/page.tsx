import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";

// ─────────────────────────────────────────────
// Root page — redirects users to their dashboard
// Unauthenticated users go to /login
// ─────────────────────────────────────────────
export default async function RootPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  const roleRedirects = {
    STUDENT: "/student/dashboard",
    PROCTOR: "/proctor/dashboard",
    ADMIN:   "/admin/dashboard",
    PARENT:  "/parent/dashboard",
  } as const;
  // Note: URLs resolve from route groups:
  //   (student)/student/dashboard → /student/dashboard
  //   (proctor)/proctor/dashboard → /proctor/dashboard
  //   (admin)/admin/dashboard     → /admin/dashboard

  redirect(roleRedirects[session.user.role] ?? "/login");
}
