import { requireActor } from "@/lib/access";
import { getCommunityMarkers } from "@/lib/community-map";
import { PageHeading } from "@/components/ui";
import { RegionalMap } from "@/components/RegionalMap";
export default async function Page() {
  await requireActor(["COORDINATOR"]);
  const events = await getCommunityMarkers();
  return (
    <>
      <PageHeading
        title="Regional meetup map"
        description="Explore active learner communities and plan the next cross-house event."
      />
      <RegionalMap events={events} />
    </>
  );
}
