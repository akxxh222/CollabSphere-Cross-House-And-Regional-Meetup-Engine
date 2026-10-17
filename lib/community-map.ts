import "server-only";
import { db } from "@/lib/db";
export async function getCommunityMarkers() {
  const [events, peers] = await Promise.all([
    db.event.findMany({
      where: { status: "APPROVED" },
      include: { _count: { select: { registrations: true } } },
    }),
    db.user.findMany({
      where: {
        approvalStatus: "APPROVED",
        isActive: true,
        latitude: { not: null },
        longitude: { not: null },
        role: { in: ["STUDENT", "COORDINATOR"] },
      },
      select: {
        id: true,
        name: true,
        city: true,
        region: true,
        house: true,
        latitude: true,
        longitude: true,
      },
    }),
  ]);
  return [
    ...events.map((event) => ({
      id: event.id,
      title: event.title,
      city: event.city,
      region: event.region,
      latitude: event.latitude,
      longitude: event.longitude,
      startsAt: event.startsAt.toISOString(),
      attendees: event._count.registrations,
      kind: "event" as const,
    })),
    ...peers.map((peer) => ({
      id: `peer-${peer.id}`,
      title: `${peer.name} · ${peer.house ?? "IIT Madras"}`,
      city: peer.city ?? "India",
      region: peer.region ?? "Learner network",
      latitude: peer.latitude!,
      longitude: peer.longitude!,
      attendees: 1,
      kind: "peer" as const,
    })),
  ];
}
