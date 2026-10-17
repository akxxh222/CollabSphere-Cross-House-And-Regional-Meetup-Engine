import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { EventForm } from "@/components/CommunityForms";
import { PageHeading } from "@/components/ui";
export default async function Page() {
  const actor = await requireActor(["COORDINATOR"]);
  const coordinators = await db.user.findMany({
    where: {
      role: "COORDINATOR",
      approvalStatus: "APPROVED",
      isActive: true,
      id: { not: actor.id },
    },
    select: { id: true, name: true, house: true },
  });
  return (
    <>
      <PageHeading
        title="Propose a joint event"
        description="Build a regional learning session and invite another house coordinator to co-host. Admin approval publishes it."
      />
      <EventForm coordinators={coordinators} />
    </>
  );
}
