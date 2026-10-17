import { requireActor } from "@/lib/access";
import { getCommunityMarkers } from "@/lib/community-map";
import { PageHeading } from "@/components/ui";
import { RegionalMap } from "@/components/RegionalMap";
export default async function Page() {
  await requireActor(["STUDENT"]);
  const events = await getCommunityMarkers();
  return (
    <>
      <PageHeading
        title="Regional meetup map"
        description="Explore approved learning meetups and coworking sessions across the IIT Madras online-degree community."
      />
      <RegionalMap events={events} />
    </>
  );
}
