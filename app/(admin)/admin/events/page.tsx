import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { PageHeading } from "@/components/ui";
import { EventGrid } from "@/components/EventExplorer";
export default async function Page() {
  const actor = await requireActor(["ADMIN"]);
  const events = await db.event.findMany({
    orderBy: [{ status: "desc" }, { startsAt: "asc" }],
    include: {
      createdBy: { select: { id: true, name: true } },
      hosts: { select: { houseName: true } },
      registrations: { select: { userId: true, status: true } },
      _count: { select: { registrations: true } },
    },
  });
  return (
    <>
      <PageHeading
        title="Event approval desk"
        description="Review coordinator proposals and manage the cross-house community calendar."
      />
      <EventGrid events={events as never} actorId={actor.id} admin />
    </>
  );
}
