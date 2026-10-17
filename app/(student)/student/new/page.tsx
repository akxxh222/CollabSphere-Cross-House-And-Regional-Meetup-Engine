import { requireActor } from "@/lib/access";
import { db } from "@/lib/db";
import { PageHeading } from "@/components/ui";
import { RequestForm } from "@/components/RequestForm";
import { ClipboardCheck, Bell, QrCode } from "lucide-react";
export const metadata = { title: "New visit request" };
export default async function Page() {
  const actor = await requireActor(["STUDENT"]);
  const [hospitals, student] = await Promise.all([db.hospital.findMany({ where: { isActive: true }, orderBy: { distanceKm: "asc" }, select: { id: true, name: true, distanceKm: true } }), db.user.findUniqueOrThrow({ where: { id: actor.id }, include: { assignedProctor: true, parent: true } })]);
  return <><PageHeading eyebrow="A simpler path to care" title="Plan your hospital visit" description="A few details now. A clear next step from your proctor." /><div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-6"><RequestForm hospitals={hospitals} ready={Boolean(student.assignedProctor?.isActive)} emergencyReady={Boolean(student.parent?.isActive && student.parent.phone)} /><aside className="space-y-5"><div className="card card-pad"><h2>What happens next?</h2><div className="mt-6 space-y-6">{[{ icon: ClipboardCheck, title: "Your proctor reviews", text: "Your assigned proctor receives the request and reviews your visit details." },{ icon: Bell, title: "Stay in the loop", text: "Follow the timeline for decisions, comments, and emergency escalation." },{ icon: QrCode, title: "Carry your visit pass", text: "Once approved, your QR pass is ready to view, download, or print." }].map(({icon: Icon,title,text},i) => <div key={title} className="flex gap-3"><span className="stat-icon !w-8 !h-8 shrink-0"><Icon size={15} /></span><div><h3 className="!text-xs">{i+1}. {title}</h3><p className="text-[11px] muted leading-5 mt-1">{text}</p></div></div>)}</div></div><div className="notice"><p><strong>Your assigned proctor</strong><br />{student.assignedProctor?.name ?? "Not yet assigned"}<br /><span className="muted">IIT Madras · CampusCare</span></p></div></aside></div></>;
}
