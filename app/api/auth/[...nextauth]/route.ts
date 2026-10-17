import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Both GET and POST must be exported from an App Router route handler
export { handler as GET, handler as POST };
