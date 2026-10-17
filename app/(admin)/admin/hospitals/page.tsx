import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { PageHeading } from "@/components/ui";
import { RecordEditor, Field } from "@/components/RecordEditor";
export const metadata = { title: "Hospital registry" };
export default async function Page() {
  await requireActor(["ADMIN"]);
  const hospitals = await db.hospital.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      address: true,
      distanceKm: true,
      phone: true,
      emergency: true,
      isActive: true,
    },
  });
  const fields: Field[] = [
    { name: "name", label: "Hospital name", required: true },
    { name: "address", label: "Address", required: true },
    {
      name: "distanceKm",
      label: "Approximate distance from IIT Madras main gate (km)",
      type: "number",
      required: true,
    },
    { name: "phone", label: "Contact number", type: "tel" },
    { name: "emergency", label: "Emergency care available", type: "checkbox" },
    {
      name: "isActive",
      label: "Visible in the hospital directory",
      type: "checkbox",
      hint: "Uncheck to archive. Historical visit records are preserved.",
    },
  ];
  return (
    <>
      <PageHeading
        title="Hospital registry"
        description="Keep nearby care options accurate and available to your campus."
      />
      <RecordEditor kind="hospital" records={hospitals} fields={fields} />
    </>
  );
}
