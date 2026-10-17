import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { PageHeading } from "@/components/ui";
import { EventGrid } from "@/components/EventExplorer";
export default async function Page() {
  const actor = await requireActor(["STUDENT"]);
  const events = await db.event.findMany({
    where: { status: "APPROVED" },
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
        title="Meetups near you"
        description="Join regional study circles, workshops, coworking sessions, and house socials."
      />
      <EventGrid events={events as never} actorId={actor.id} />
    </>
  );
}
