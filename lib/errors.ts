import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
export class AppError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function publicError(error: unknown) {
  if (error instanceof AppError) return { error: error.message, status: error.status };
  if (error instanceof ZodError)
    return { error: error.issues[0]?.message ?? "Invalid input", status: 400 };
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
    return { error: "A record with those details already exists", status: 409 };
  console.error("Operation failed", error instanceof Error ? error.name : "Unknown error");
  return { error: "Unable to complete this action. Please try again.", status: 500 };
}
