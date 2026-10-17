import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { PageHeading } from "@/components/ui";
import { SettingsForm } from "@/components/SettingsForm";
export const metadata = { title: "System settings" };
export default async function Page() { await requireActor(["ADMIN"]); const settings = await db.systemSettings.upsert({ where: { id: "default" }, create: { id: "default" }, update: {} }); return <><PageHeading title="Thoughtful defaults. Your control." description="Configure review deadlines and the messages that keep your care team connected." /><SettingsForm settings={{ escalationTimeoutMs: settings.escalationTimeoutMs, smsTemplate: settings.smsTemplate, emailTemplate: settings.emailTemplate }} /></>; }
