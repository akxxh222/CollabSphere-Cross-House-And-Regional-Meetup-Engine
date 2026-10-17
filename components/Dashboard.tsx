import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { requireActor } from "@/lib/access";
import { db } from "@/lib/db";
import { getStats, listRequests } from "@/lib/queries";
import { PageHeading, StatCard } from "./ui";
import { RequestTable } from "./RequestTable";
import { AnalyticsChart } from "./AnalyticsChart";
export async function Dashboard() {
  const actor = await requireActor();
  const [stats, requests, settings, hospitals] = await Promise.all([
    getStats(actor),
    listRequests(actor),
    db.systemSettings.findUnique({ where: { id: "default" } }),
    db.hospital.findMany({ where: { isActive: true }, orderBy: { distanceKm: "asc" }, take: 3 }),
  ]);
  const root = `/${actor.role.toLowerCase()}`;
  const student = actor.role === "STUDENT";
  const admin = actor.role === "ADMIN";
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Your campus. Your care."
        title={
          student
            ? `Hello, ${actor.name.split(" ")[0]}.`
            : actor.role === "PARENT"
              ? "A little peace of mind."
              : "Every request matters."
        }
        description={
          student
            ? "Here's where your care journey stands today."
            : "A clear view of hospital visits, timely decisions, and the people behind them."
        }
      >
        {student && (
          <Link href="/student/new" className="btn btn-primary">
            <Plus size={15} />
            <span className="hidden sm:inline">New visit request</span>
            <span className="sm:hidden">Request</span>
          </Link>
        )}
      </PageHeading>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total requests"
          value={stats.total}
          detail={student ? "Your visits, in one place" : "Across your workspace"}
          icon={<ClipboardList size={18} />}
        />
        <StatCard
          title={admin ? "Approval rate" : "Awaiting review"}
          value={admin ? `${stats.approvalRate}%` : stats.pending}
          detail={admin ? "Approved / all requests" : "Ready for the next step"}
          icon={<Clock3 size={18} />}
        />
        <StatCard
          title={admin ? "Average response" : "Approved visits"}
          value={
            admin ? (stats.avgMinutes === null ? "—" : `${stats.avgMinutes}m`) : stats.approved
          }
          detail={admin ? "Time to approval or rejection" : "Cleared for your hospital visit"}
          icon={<CheckCircle2 size={18} />}
        />
        <StatCard
          title="Active emergencies"
          value={stats.emergencies}
          detail={stats.emergencies ? "Priority attention needed" : "No active emergency requests"}
          icon={<Activity size={18} />}
          highlight
        />
      </div>
      <div className="grid xl:grid-cols-[minmax(0,1.7fr)_minmax(270px,1fr)] gap-6">
        {student || actor.role === "PARENT" ? (
          <div className="hero-banner p-7 sm:p-9 flex flex-col justify-between min-h-[280px]">
            <div className="hero-orbit" />
            <div className="relative max-w-sm">
              <span className="eyebrow !text-inherit opacity-75">
                Care starts with a simple step
              </span>
              <h2 className="!text-3xl mt-4 leading-tight">
                Less waiting.
                <br />
                More looking after you.
              </h2>
              <p className="text-xs leading-6 mt-4 max-w-xs">
                Submit your visit details, follow each update, and keep your approved pass close. We
                keep everyone connected along the way.
              </p>
            </div>
            <Link
              className="flex items-center gap-2 text-xs font-semibold mt-6 relative"
              href={student ? "/student/new" : "/parent/requests"}
            >
              {student ? "Start a visit request" : "View linked student requests"}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        ) : (
          <AnalyticsChart data={stats.trend} />
        )}
        <div className="card card-pad flex flex-col">
          <div className="section-heading">
            <h2>Care nearby</h2>
            <Building2 size={18} className="muted" />
          </div>
          <p className="muted text-[11px] mb-4">Around the IIT Madras campus</p>
          <div className="space-y-4 flex-1">
            {hospitals.map((h, i) => (
              <div key={h.id} className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-lg bg-[var(--surface-soft)] grid place-items-center text-xs muted">
                  0{i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">{h.name}</p>
                  <p className="text-[10px] muted mt-1">~{h.distanceKm} km from campus</p>
                </div>
                <ArrowUpRight size={14} className="muted" />
              </div>
            ))}
            {!hospitals.length && (
              <p className="text-xs muted">
                Your administrator can add nearby hospitals to the registry.
              </p>
            )}
          </div>
          <Link href={`${root}/hospitals`} className="btn btn-secondary w-full mt-5 text-xs">
            Explore hospitals <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      {stats.emergencies > 0 && (
        <div className="notice notice-warning">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <strong>
              {stats.emergencies} emergency{" "}
              {stats.emergencies === 1 ? "request needs" : "requests need"} attention.
            </strong>
            <p>
              Pending emergencies escalate after {(settings?.escalationTimeoutMs ?? 180000) / 60000}{" "}
              minutes. In an immediate emergency, seek medical help directly; do not wait for
              approval.
            </p>
          </div>
        </div>
      )}
      <RequestTable
        initial={requests}
        role={actor.role}
        timeout={settings?.escalationTimeoutMs ?? 180000}
        compact
      />
      <div className="flex items-center justify-center gap-2 muted text-[10px]">
        <ShieldCheck size={13} />
        Your information is visible only to your assigned care team.
      </div>
    </div>
  );
}
