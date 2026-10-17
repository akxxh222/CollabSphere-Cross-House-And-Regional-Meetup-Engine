import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { EventForm } from "@/components/CommunityForms";
import { PageHeading } from "@/components/ui";
export default async function Page() {
  await requireActor(["ADMIN"]);
  const coordinators = await db.user.findMany({
    where: { role: "COORDINATOR", approvalStatus: "APPROVED", isActive: true },
    select: { id: true, name: true, house: true },
  });
  return (
    <>
      <PageHeading
        title="Create and publish a meetup"
        description="Launch an official regional session or assemble a cross-house host team."
      />
      <EventForm coordinators={coordinators} />
    </>
  );
}
