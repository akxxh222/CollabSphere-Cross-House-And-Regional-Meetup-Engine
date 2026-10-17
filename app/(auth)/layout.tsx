import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Layout({ children }: { children: React.ReactNode }) { const session = await getAuthSession(); if (session) redirect(`/${session.user.role.toLowerCase()}/dashboard`); return children; }
