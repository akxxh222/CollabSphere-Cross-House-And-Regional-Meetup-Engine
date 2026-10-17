import Link from "next/link";
import { CalendarDays, MapPin, Users, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { PageHeading, StatCard } from "@/components/ui";
import { RegionalMap } from "@/components/RegionalMap";
import { EventGrid } from "@/components/EventExplorer";
export async function CommunityDashboard({ role }: { role: "STUDENT" | "COORDINATOR" | "ADMIN" }) {
  const actor = await requireActor([role]);
  const [events, members, checkIns] = await Promise.all([
    db.event.findMany({
      where: role === "ADMIN" ? {} : { status: "APPROVED" },
      orderBy: { startsAt: "asc" },
      take: 6,
      include: {
        createdBy: { select: { id: true, name: true } },
        hosts: { select: { houseName: true } },
        registrations: { select: { userId: true, status: true } },
        _count: { select: { registrations: true } },
      },
    }),
    db.user.count({ where: { approvalStatus: "APPROVED", isActive: true } }),
    db.checkIn.count(),
  ]);
  const mapped = events
    .filter((e) => e.status === "APPROVED")
    .map((e) => ({
      id: e.id,
      title: e.title,
      city: e.city,
      region: e.region,
      latitude: e.latitude,
      longitude: e.longitude,
      startsAt: e.startsAt.toISOString(),
      attendees: e._count.registrations,
    }));
  const pending = events.filter((e) => e.status === "PROPOSED").length;
  return (
    <>
      <PageHeading
        eyebrow="Regional network"
        title={`Welcome back, ${actor.name.split(" ")[0]}`}
        description="Meet nearby IIT Madras learners, turn online connections into local study momentum, and build your house community."
      >
        <Link
          className="btn btn-primary"
          href={`/${role.toLowerCase()}/${role === "STUDENT" ? "events" : "events/new"}`}
        >
          {role === "STUDENT" ? "Explore meetups" : "Create meetup"}
        </Link>
      </PageHeading>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Upcoming meetups"
          value={events.filter((e) => e.status === "APPROVED").length}
          detail="Across the network"
          icon={<CalendarDays size={18} />}
        />
        <StatCard
          title="Active learners"
          value={members}
          detail="Approved members"
          icon={<Users size={18} />}
        />
        <StatCard
          title="Verified visits"
          value={checkIns}
          detail="Proof of presence"
          icon={<MapPin size={18} />}
        />
        <StatCard
          title={role === "ADMIN" ? "Awaiting review" : "Community points"}
          value={
            role === "ADMIN"
              ? pending
              : ((
                  await db.user.findUnique({
                    where: { id: actor.id },
                    select: { activityPoints: true },
                  })
                )?.activityPoints ?? 0)
          }
          detail={role === "ADMIN" ? "Coordinator proposals" : "Earned by checking in"}
          icon={<Sparkles size={18} />}
          highlight
        />
      </div>
      <div className="grid xl:grid-cols-[1.2fr_.8fr] gap-6 mb-8">
        <RegionalMap events={mapped} />
        <div className="card card-pad">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2">A trusted local layer for an online degree</h2>
          <div className="space-y-5 mt-6">
            {[
              [
                "01",
                "Discover",
                "Use the regional map to find meetups, coworking sessions, and peers.",
              ],
              [
                "02",
                "Collaborate",
                "Coordinators propose joint events across houses; admins approve them.",
              ],
              ["03", "Show up", "Scan the event QR to verify attendance and earn activity points."],
            ].map(([n, t, d]) => (
              <div className="flex gap-4" key={n}>
                <span className="avatar">{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p className="muted text-xs mt-1 leading-relaxed">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Next up</p>
          <h2 className="mt-1">Community calendar</h2>
        </div>
      </div>
      <EventGrid events={events as never} actorId={actor.id} admin={role === "ADMIN"} />
    </>
  );
}
