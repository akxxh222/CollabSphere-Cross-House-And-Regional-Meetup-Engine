import "server-only";
import { Prisma, Role } from "@prisma/client";
import { getAuthSession } from "@/lib/auth";
import { AppError } from "@/lib/errors";
export type Actor = { id: string; role: Role; name: string; email: string };
export async function requireActor(roles?: Role[]): Promise<Actor> {
  const session = await getAuthSession();
  if (!session) throw new AppError("Please sign in", 401);
  if (roles && !roles.includes(session.user.role)) throw new AppError("You do not have permission", 403);
  return session.user;
}
export function requestScope(actor: Actor): Prisma.RequestWhereInput {
  switch (actor.role) {
    case "ADMIN": return {};
    case "STUDENT": return { studentId: actor.id };
    case "PROCTOR": return { student: { assignedProctorId: actor.id } };
    case "PARENT": return { student: { parentId: actor.id } };
  }
}
