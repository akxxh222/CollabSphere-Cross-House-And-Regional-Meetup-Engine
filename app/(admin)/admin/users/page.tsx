import { db } from "@/lib/db";
import { requireActor } from "@/lib/access";
import { PageHeading } from "@/components/ui";
import { RecordEditor, Field } from "@/components/RecordEditor";
export const metadata = { title: "People & access" };
export default async function Page() {
  await requireActor(["ADMIN"]);
  const users = await db.user.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, email: true, role: true, isActive: true, registerNo: true, phone: true, department: true, parentId: true, assignedProctorId: true } });
  const options = (role: string) => [{ value: "", label: "Not assigned" }, ...users.filter(u => u.role === role && u.isActive).map(u => ({ value: u.id, label: u.name }))];
  const fields: Field[] = [{ name: "name", label: "Full name", required: true },{ name: "email", label: "Email address", type: "email", required: true, hint: "Students use @iitm.ac.in. Parents may use their personal email." },{ name: "password", label: "Password", type: "password", hint: "At least 10 characters. Leave empty when editing to keep the current password." },{ name: "role", label: "Role", options: ["STUDENT","PROCTOR","PARENT","ADMIN"].map(r => ({ value: r, label: r.charAt(0)+r.slice(1).toLowerCase() })) },{ name: "registerNo", label: "Student register number" },{ name: "department", label: "Department" },{ name: "phone", label: "Phone number", type: "tel", hint: "International format, e.g. +919876543210. Required on parent accounts for emergency SMS." },{ name: "assignedProctorId", label: "Assigned proctor (students only)", options: options("PROCTOR") },{ name: "parentId", label: "Linked parent (students only)", options: options("PARENT") },{ name: "isActive", label: "Account is active", type: "checkbox", hint: "Deactivated accounts lose access immediately. Reassign linked students first." }];
  return <><PageHeading title="People & access" description="Connect students with their proctors and parents. Keep access intentional." /><RecordEditor kind="user" records={users} fields={fields} /></>;
}
