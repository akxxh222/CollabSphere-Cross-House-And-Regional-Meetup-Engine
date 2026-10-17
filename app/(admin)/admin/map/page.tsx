import { requireActor } from "@/lib/access";
import { getCommunityMarkers } from "@/lib/community-map";
import { PageHeading } from "@/components/ui";
import { RegionalMap } from "@/components/RegionalMap";
export default async function Page() {
  await requireActor(["ADMIN"]);
  const events = await getCommunityMarkers();
  return (
    <>
      <PageHeading
        title="Regional network"
        description="See where the community is active and identify regions ready for their next meetup."
      />
      <RegionalMap events={events} />
    </>
  );
}
