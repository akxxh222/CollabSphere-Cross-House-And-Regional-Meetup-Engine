import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
const homes: Record<string, string> = {
  STUDENT: "/student/dashboard",
  COORDINATOR: "/coordinator/dashboard",
  ADMIN: "/admin/dashboard",
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
export const config = { matcher: ["/student/:path*", "/coordinator/:path*", "/admin/:path*"] };
