import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { PageHeading } from "@/components/ui";
import { MembershipQueue } from "@/components/EventExplorer";
export default async function Page() {
  await requireActor(["ADMIN"]);
  const users = await db.user.findMany({
    where: { approvalStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      registerNo: true,
      studyProgram: true,
      city: true,
      region: true,
      createdAt: true,
    },
  });
  return (
    <>
      <PageHeading
        title="Membership approvals"
        description="Verify IIT Madras learner applications before they can sign in or join regional activities."
      />
      <MembershipQueue users={users} />
    </>
  );
}
