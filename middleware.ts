import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
const homes: Record<string, string> = {
  STUDENT: "/student/dashboard",
  PROCTOR: "/proctor/dashboard",
  ADMIN: "/admin/dashboard",
  PARENT: "/parent/dashboard",
};
export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string;
    const section = req.nextUrl.pathname.split("/")[1].toUpperCase();
    if (role !== section) return NextResponse.redirect(new URL(homes[role] ?? "/login", req.url));
    return NextResponse.next();
  },
  { pages: { signIn: "/login" }, callbacks: { authorized: ({ token }) => Boolean(token) } },
);
export const config = {
  matcher: ["/student/:path*", "/proctor/:path*", "/admin/:path*", "/parent/:path*"],
};
