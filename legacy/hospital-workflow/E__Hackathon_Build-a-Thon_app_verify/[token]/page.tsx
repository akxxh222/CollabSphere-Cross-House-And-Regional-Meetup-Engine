import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ShieldCheck, ShieldX, Activity } from "lucide-react";
import { formatDate } from "@/components/ui";
export const dynamic = "force-dynamic";
export const metadata = { title: "Verify visit pass", robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{48}$/.test(token)) notFound();
  const request = await db.request.findUnique({
    where: { passToken: token },
    select: {
      status: true,
      hospitalName: true,
      visitDate: true,
      returnDate: true,
      student: { select: { registerNo: true } },
    },
  });
  if (!request) notFound();
  const expires = request.returnDate ?? new Date(request.visitDate.getTime() + 24 * 60 * 60_000);
  const valid = request.status === "APPROVED" && expires.getTime() >= Date.now();
  return (
    <main id="main-content" className="min-h-screen grid place-items-center p-6">
      <div className="card card-pad w-full max-w-md text-center">
        <div className="brand justify-center mb-8">
          <span className="brand-mark">
            <Activity size={22} />
          </span>
          CampusCare.
        </div>
        {valid ? (
          <ShieldCheck size={44} className="accent mx-auto" />
        ) : (
          <ShieldX size={44} className="text-red-600 mx-auto" />
        )}
        <h1 className="!text-2xl mt-5">
          {valid ? "Verified visit authorization" : "This pass is no longer valid"}
        </h1>
        <p className="muted text-xs mt-3">IIT Madras · Hospital visit pass</p>
        <dl className="text-left mt-8 space-y-5">
          <div>
            <dt className="label muted">Student ID</dt>
            <dd>{request.student.registerNo ?? "Confirm using student identity card"}</dd>
          </div>
          <div>
            <dt className="label muted">Hospital</dt>
            <dd>{request.hospitalName}</dd>
          </div>
          <div>
            <dt className="label muted">Scheduled departure</dt>
            <dd>{formatDate(request.visitDate, true)} IST</dd>
          </div>
          <div>
            <dt className="label muted">Valid until</dt>
            <dd>{formatDate(expires, true)} IST</dd>
          </div>
        </dl>
        <p className="notice mt-7 text-left">
          Match the student ID with the student&apos;s identity card. This pass confirms
          authorization only.
        </p>
      </div>
    </main>
  );
}
