import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
// JWT credentials authentication does not need an OAuth database adapter.
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, pages: { signIn: "/login", error: "/login" },
  providers: [CredentialsProvider({ name: "credentials", credentials: { email: { type: "email" }, password: { type: "password" } },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;
      const { email, password } = parsed.data;
      const key = createHash("sha256").update(email).digest("hex");
      await db.loginAttempt.deleteMany({ where: { key, resetAt: { lt: new Date() } } });
      const attempt = await db.loginAttempt.upsert({ where: { key }, create: { key, resetAt: new Date(Date.now() + 15 * 60_000) }, update: { count: { increment: 1 } } });
      if (attempt.count > 15) return null;
      const user = await db.user.findUnique({ where: { email } });
      if (!user?.isActive || !user.password || !await bcrypt.compare(password, user.password)) return null;
      await db.loginAttempt.deleteMany({ where: { key } });
      return { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image };
    },
  })],
  callbacks: {
    async jwt({ token, user }) { if (user) { token.id = user.id; token.role = user.role; } return token; },
    async session({ session, token }) { session.user.id = token.id; session.user.role = token.role; return session; },
  },
};
// Deactivation and role edits take effect on the next server access, even with an existing JWT.
export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { id: true, name: true, email: true, role: true, image: true, isActive: true } });
  return user?.isActive ? { ...session, user } : null;
}
export const hashPassword = (plain: string) => bcrypt.hash(plain, 12);
