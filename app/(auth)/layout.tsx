import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";

// Auth layout — redirect already-logged-in users to their dashboard
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (session) {
    const roleRedirects = {
      STUDENT: "/student/dashboard",
      PROCTOR: "/proctor/dashboard",
      ADMIN:   "/admin/dashboard",
      PARENT:  "/parent/requests",
    } as const;
    redirect(roleRedirects[session.user.role] ?? "/");
  }

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, hsl(220,80%,10%) 0%, hsl(250,60%,15%) 100%)" }}
    >
      {children}
    </main>
  );
}
