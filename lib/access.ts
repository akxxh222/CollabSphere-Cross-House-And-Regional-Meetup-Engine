import "server-only";
import type { Role } from "@prisma/client";
import { getAuthSession } from "@/lib/auth";
import { AppError } from "@/lib/errors";
export type Actor = { id: string; role: Role; name: string; email: string };
export async function requireActor(roles?: Role[]): Promise<Actor> {
  const session = await getAuthSession();
  if (!session) throw new AppError("Please sign in", 401);
  if (roles && !roles.includes(session.user.role))
    throw new AppError("You do not have permission", 403);
  return session.user;
}
