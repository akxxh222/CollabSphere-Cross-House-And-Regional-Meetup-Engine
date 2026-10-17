import Link from "next/link";
import { CalendarDays, MapPin, Users, Sparkles, QrCode } from "lucide-react";
import { formatDate } from "@/components/ui";
import { registerAction, reviewEventAction, reviewUserAction } from "@/lib/actions/community";

type EventCardData = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  city: string;
  region: string;
  venue: string;
  startsAt: Date;
  capacity: number;
  points: number;
  qrToken: string;
  createdBy: { id: string; name: string };
  hosts: { houseName: string }[];
  registrations: { userId: string; status: string }[];
  _count: { registrations: number };
};
export function EventGrid({
  events,
  actorId,
  admin = false,
}: {
  events: EventCardData[];
  actorId: string;
  admin?: boolean;
}) {
  if (!events.length)
    return (
      <div className="empty-state">
        <h3>No meetups match this view</h3>
        <p className="muted mt-2">New regional sessions will appear here.</p>
      </div>
    );
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
      {events.map((event) => {
        const joined = event.registrations.some(
          (r) => r.userId === actorId && r.status !== "CANCELLED",
        );
        return (
          <article key={event.id} className="card overflow-hidden group">
            <div className="event-cover">
              <span className="badge badge-approved">{event.type.replaceAll("_", " ")}</span>
              <span className="points-pill">
                <Sparkles size={13} />
                {event.points} pts
              </span>
            </div>
            <div className="card-pad">
              <div className="flex justify-between gap-3">
                <h2>{event.title}</h2>
                <span className={`badge badge-${event.status.toLowerCase()}`}>{event.status}</span>
              </div>
              <p className="muted text-xs leading-relaxed mt-3 line-clamp-2">{event.description}</p>
              <div className="event-meta">
                <span>
                  <CalendarDays size={14} />
                  {formatDate(event.startsAt, true)}
                </span>
                <span>
                  <MapPin size={14} />
                  {event.venue}, {event.city}
                </span>
                <span>
                  <Users size={14} />
                  {event._count.registrations}/{event.capacity} learners
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                {admin && event.status === "PROPOSED" ? (
                  <>
                    <form action={reviewEventAction.bind(null, event.id, "APPROVED")}>
                      <button className="btn btn-primary">Approve</button>
                    </form>
                    <form action={reviewEventAction.bind(null, event.id, "REJECTED")}>
                      <button className="btn btn-secondary">Decline</button>
                    </form>
                  </>
                ) : !admin && event.status === "APPROVED" ? (
                  <form action={registerAction.bind(null, event.id)}>
                    <button className="btn btn-primary" disabled={joined}>
                      {joined ? "You’re going" : "Join meetup"}
                    </button>
                  </form>
                ) : null}
                {(admin || event.createdBy.id === actorId) && (
                  <Link className="btn btn-secondary" href={`/check-in/${event.qrToken}`}>
                    <QrCode size={15} />
                    Check-in
                  </Link>
                )}
              </div>
              <p className="text-[10px] muted mt-4">
                Hosted by {event.hosts.map((h) => h.houseName).join(" + ") || event.createdBy.name}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
export function MembershipQueue({
  users,
}: {
  users: {
    id: string;
    name: string;
    email: string;
    registerNo: string | null;
    studyProgram: string | null;
    city: string | null;
    region: string | null;
    createdAt: Date;
  }[];
}) {
  if (!users.length)
    return (
      <div className="empty-state">
        <h3>Approval queue is clear</h3>
        <p className="muted mt-2">New student signups will appear here.</p>
      </div>
    );
  return (
    <div className="card overflow-hidden">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Program</th>
              <th>Region</th>
              <th>Requested</th>
              <th>Decision</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.name}</strong>
                  <div className="muted text-[11px]">
                    {user.email} · {user.registerNo}
                  </div>
                </td>
                <td>{user.studyProgram}</td>
                <td>
                  {user.city}, {user.region}
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className="flex gap-2">
                    <form action={reviewUserAction.bind(null, user.id, "APPROVED")}>
                      <button className="btn btn-primary">Approve</button>
                    </form>
                    <form action={reviewUserAction.bind(null, user.id, "REJECTED")}>
                      <button className="btn btn-secondary">Reject</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
