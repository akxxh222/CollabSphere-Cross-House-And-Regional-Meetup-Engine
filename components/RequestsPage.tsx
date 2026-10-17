import Link from "next/link";
import { Plus } from "lucide-react";
import { requireActor } from "@/lib/access";
import { db } from "@/lib/db";
import { listRequests } from "@/lib/queries";
import { PageHeading } from "./ui";
import { RequestTable } from "./RequestTable";
export async function RequestsPage() {
  const actor = await requireActor();
  const [initial, settings] = await Promise.all([
    listRequests(actor),
    db.systemSettings.findUnique({ where: { id: "default" } }),
  ]);
  return (
    <>
      <PageHeading
        title={actor.role === "STUDENT" ? "Your visit requests" : "Visit requests"}
        description="Every visit, every decision, and every update in one place."
      >
        {actor.role === "STUDENT" && (
          <Link href="/student/new" className="btn btn-primary">
            <Plus size={15} />
            New request
          </Link>
        )}
      </PageHeading>
      <RequestTable
        initial={initial}
        role={actor.role}
        timeout={settings?.escalationTimeoutMs ?? 180000}
      />
    </>
  );
}
