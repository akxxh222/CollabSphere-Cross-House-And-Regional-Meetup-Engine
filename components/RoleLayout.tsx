import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { AppShell } from "./AppShell";
export async function RoleLayout({
  role,
  children,
}: {
  role: "STUDENT" | "COORDINATOR" | "ADMIN";
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  if (session.user.role !== role) redirect(`/${session.user.role.toLowerCase()}/dashboard`);
  return <AppShell user={session.user}>{children}</AppShell>;
}
