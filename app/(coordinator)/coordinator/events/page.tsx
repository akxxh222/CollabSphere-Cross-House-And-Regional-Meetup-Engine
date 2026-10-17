import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { PageHeading } from "@/components/ui";
import { EventGrid } from "@/components/EventExplorer";
export default async function Page() {
  const actor = await requireActor(["COORDINATOR"]);
  const events = await db.event.findMany({
    where: { OR: [{ status: "APPROVED" }, { createdById: actor.id }] },
    orderBy: { startsAt: "asc" },
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
        title="Meetup manager"
        description="Track your proposals and join approved sessions across regions and houses."
      />
      <EventGrid events={events as never} actorId={actor.id} />
    </>
  );
}
