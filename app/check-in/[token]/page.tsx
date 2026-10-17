import { redirect } from "next/navigation";
import QRCode from "qrcode";
import Image from "next/image";
import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { checkInAction } from "@/lib/actions/community";
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const actor = await requireActor();
  const event = await db.event.findUnique({ where: { qrToken: token } });
  if (!event) redirect(`/${actor.role.toLowerCase()}/events`);
  const qr = await QRCode.toDataURL(
    `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/check-in/${token}`,
  );
  return (
    <main id="main-content" className="min-h-screen grid place-items-center p-6">
      <div className="card card-pad max-w-md text-center">
        <p className="eyebrow">Proof of presence</p>
        <h1 className="mt-2">{event.title}</h1>
        <p className="muted text-xs mt-3">
          Scan this code at the venue, or use the button below while signed in, to earn{" "}
          {event.points} activity points.
        </p>
        <Image
          className="mx-auto my-6 rounded-xl"
          src={qr}
          alt={`Check-in QR for ${event.title}`}
          width={220}
          height={220}
        />
        <form action={checkInAction.bind(null, token)}>
          <button className="btn btn-primary w-full">Verify my attendance</button>
        </form>
      </div>
    </main>
  );
}
