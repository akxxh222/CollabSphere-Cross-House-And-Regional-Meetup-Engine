import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { Building2, MapPin, ArrowUpRight, Phone } from "lucide-react";
import { PageHeading, EmptyState } from "./ui";
export async function HospitalsPage() {
  await requireActor();
  const hospitals = await db.hospital.findMany({
    where: { isActive: true },
    orderBy: { distanceKm: "asc" },
  });
  return (
    <>
      <PageHeading
        title="Care, closer to campus"
        description="Hospitals around IIT Madras. Find the right destination for your visit."
      />
      <div className="notice mb-6">
        <MapPin size={18} className="shrink-0 mt-1" />
        <p>
          Distances are approximate from the IIT Madras main gate and vary by route. Confirm
          services and opening hours directly with the hospital before traveling.
        </p>
      </div>
      {!hospitals.length ? (
        <div className="card">
          <EmptyState
            title="Hospital directory is being prepared"
            description="Your campus administrator can add hospitals to the registry."
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {hospitals.map((h) => (
            <article key={h.id} className="card card-pad flex flex-col">
              <div className="flex justify-between items-center mb-5">
                <span className="stat-icon !w-12 !h-12">
                  <Building2 size={22} className="accent" />
                </span>
                {h.emergency && <span className="badge badge-approved">Emergency care</span>}
              </div>
              <h2 className="mb-2">{h.name}</h2>
              <p className="text-xs muted leading-6 flex-1">{h.address}</p>
              <p className="text-xs accent mt-4 flex gap-1.5 items-center">
                <MapPin size={13} />
                Approximately {h.distanceKm} km away
              </p>
              <div className="flex gap-2 mt-6 border-t pt-5">
                <a
                  className="btn btn-secondary flex-1"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.name} ${h.address}`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Directions <ArrowUpRight size={14} />
                </a>
                {h.phone && (
                  <a
                    className="icon-btn"
                    href={`tel:${h.phone.replace(/[^+\d]/g, "")}`}
                    aria-label={`Call ${h.name}`}
                  >
                    <Phone size={15} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
