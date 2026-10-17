import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { PageHeading } from "@/components/ui";
import { Building2, Phone, MapPin } from "lucide-react";
export async function HospitalDirectory() {
  await requireActor();
  const hospitals = await db.hospital.findMany({
    where: { isActive: true },
    orderBy: { distanceKm: "asc" },
  });
  return (
    <>
      <PageHeading
        eyebrow="Optional support reference"
        title="Hospitals near IIT Madras"
        description="These facilities are listed only as a practical reference for learners visiting IIT Madras. Contact the hospital directly before travelling; CollabSphere does not manage medical visits."
      />
      <div className="notice notice-warning mb-6">
        For emergencies, call local emergency services. Distances are approximate from the IIT
        Madras main gate.
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {hospitals.map((h) => (
          <article className="card card-pad" key={h.id}>
            <span className="stat-icon">
              <Building2 size={18} />
            </span>
            <h2 className="mt-4">{h.name}</h2>
            <p className="muted text-xs mt-3 flex gap-2">
              <MapPin size={14} />
              {h.address}
            </p>
            <div className="flex justify-between items-center mt-5">
              <span className="badge badge-approved">{h.distanceKm} km away</span>
              {h.phone && (
                <a className="btn btn-secondary" href={`tel:${h.phone}`}>
                  <Phone size={14} />
                  Call
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
