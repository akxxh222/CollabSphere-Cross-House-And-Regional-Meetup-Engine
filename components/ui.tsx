import { ClipboardList, ArrowUpRight } from "lucide-react";
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge badge-${status.toLowerCase()}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
export function EmptyState({
  title = "Nothing here just yet",
  description = "New activity will appear here.",
  children,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-art" aria-hidden="true">
        <ClipboardList size={30} strokeWidth={1.4} />
      </div>
      <h3>{title}</h3>
      <p className="muted text-xs mt-2 mb-5 max-w-sm mx-auto leading-relaxed">{description}</p>
      {children}
    </div>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading mb-7">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1>{title}</h1>
        <p className="muted text-xs mt-2 leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0 pt-1">{children}</div>
    </div>
  );
}
export function StatCard({
  title,
  value,
  detail,
  icon,
  highlight,
}: {
  title: string;
  value: React.ReactNode;
  detail: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`card card-pad ${highlight ? "card-glass" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs muted">{title}</span>
        <span className="stat-icon" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="text-3xl font-semibold tracking-tight mt-4 mb-3">{value}</div>
      <div className="flex items-center gap-1.5 text-[10px] muted">
        <ArrowUpRight size={12} className="accent" />
        {detail}
      </div>
    </div>
  );
}
export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading page" aria-busy="true" className="space-y-6">
      <div className="skeleton w-64 h-9" />
      <div className="skeleton w-80 max-w-full h-4" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card card-pad space-y-4">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-9 w-20" />
          </div>
        ))}
      </div>
      <div className="card card-pad">
        <div className="skeleton h-64 w-full" />
      </div>
    </div>
  );
}
export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}
export function formatDate(value: string | Date, time = false) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}
