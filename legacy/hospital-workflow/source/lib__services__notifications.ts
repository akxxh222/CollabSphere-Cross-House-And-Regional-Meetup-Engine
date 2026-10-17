import "server-only";
import { Prisma, RequestStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { renderTemplate } from "@/lib/domain";

export async function queueNotifications(
  tx: Prisma.TransactionClient,
  requestId: string,
  status: RequestStatus,
) {
  const request = await tx.request.findUniqueOrThrow({
    where: { id: requestId },
    include: { student: { include: { parent: true, assignedProctor: true } } },
  });
  const settings = await tx.systemSettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });
  const data = {
    student: request.student.name,
    hospital: request.hospitalName,
    status: status.toLowerCase(),
  };
  const recipients: { type: "SMS" | "EMAIL"; recipient: string; template: string }[] = [];
  const proctor = request.student.assignedProctor;
  if (proctor?.isActive)
    recipients.push({ type: "EMAIL", recipient: proctor.email, template: settings.emailTemplate });
  if (status === "ESCALATED" && request.student.parent?.isActive && request.student.parent.phone)
    recipients.push({
      type: "SMS",
      recipient: request.student.parent.phone,
      template: settings.smsTemplate,
    });
  for (const recipient of recipients) {
    const dedupeKey = `${requestId}:${status}:${recipient.type}:${recipient.recipient}`;
    await tx.notification.upsert({
      where: { dedupeKey },
      update: {},
      create: {
        requestId,
        type: recipient.type,
        recipient: recipient.recipient,
        message: renderTemplate(recipient.template, data),
        status: "QUEUED",
        dedupeKey,
      },
    });
  }
}

// Claim each item with a conditional update. Unknown outcomes require operator review:
// blindly retrying a timed-out SMS can send a duplicate message to a parent.
export async function dispatchNotifications() {
  await db.notification.updateMany({
    where: { status: "PROCESSING", lockedAt: { lt: new Date(Date.now() - 5 * 60_000) } },
    data: {
      status: "FAILED",
      errorMsg:
        "Delivery outcome unknown after worker interruption; inspect provider logs before retrying.",
    },
  });
  const pending = await db.notification.findMany({
    where: { status: "QUEUED" },
    take: 40,
    orderBy: { sentAt: "asc" },
  });
  let processed = 0;
  for (const item of pending) {
    const claimed = await db.notification.updateMany({
      where: { id: item.id, status: "QUEUED" },
      data: { status: "PROCESSING", lockedAt: new Date(), attempts: { increment: 1 } },
    });
    if (!claimed.count) continue;
    try {
      const mock =
        (item.type === "SMS" ? process.env.TWILIO_MOCK_MODE : process.env.EMAIL_MOCK_MODE) !==
        "false";
      let providerId: string | undefined;
      if (!mock && item.type === "SMS") {
        const {
          TWILIO_ACCOUNT_SID: sid,
          TWILIO_AUTH_TOKEN: token,
          TWILIO_PHONE_NUMBER: from,
        } = process.env;
        if (!sid || !token || !from) throw new Error("SMS provider configuration missing");
        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ To: item.recipient, From: from, Body: item.message }),
            signal: AbortSignal.timeout(10_000),
          },
        );
        if (!response.ok) throw new Error(`SMS provider rejected request (${response.status})`);
        providerId = (await response.json()).sid;
      } else if (!mock) {
        if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)
          throw new Error("Email provider configuration missing");
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
            "Idempotency-Key": item.id,
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM,
            to: [item.recipient],
            subject: "CampusCare · hospital visit update",
            text: item.message,
          }),
          signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) throw new Error(`Email provider rejected request (${response.status})`);
        providerId = (await response.json()).id;
      }
      await db.notification.update({
        where: { id: item.id },
        data: {
          status: mock ? "MOCK" : "SENT",
          providerId,
          sentAt: new Date(),
          lockedAt: null,
          errorMsg: null,
        },
      });
      processed++;
    } catch (error) {
      await db.notification.update({
        where: { id: item.id },
        data: {
          status: "FAILED",
          lockedAt: null,
          errorMsg:
            error instanceof Error && /configuration missing|provider rejected/.test(error.message)
              ? error.message
              : "Provider outcome unknown. Check provider logs before retrying.",
        },
      });
    }
  }
  return processed;
}
