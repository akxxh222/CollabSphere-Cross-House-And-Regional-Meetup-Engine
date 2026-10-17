"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X, ArrowUpRight } from "lucide-react";
import { reviewRequest } from "@/lib/actions/requests";
export function ReviewPanel({ id, status }: { id: string; status: string }) {
  const [note,setNote] = useState(""); const [pending,startTransition] = useTransition(); const router = useRouter(); const client = useQueryClient();
  function review(action: "APPROVE" | "REJECT" | "ESCALATE") { startTransition(async () => { const result = await reviewRequest({ requestId: id, action, proctorNote: note }); if (!result.success) toast.error(result.error); else { toast.success("Request updated"); await client.invalidateQueries({ queryKey: ["requests"] }); router.refresh(); } }); }
  return <div className="card card-pad no-print"><h2>Review this request</h2><p className="text-xs muted mt-2 mb-5">Your decision and comment are added to the request timeline.</p><label htmlFor="review-note" className="label">Comment</label><textarea id="review-note" className="input min-h-24" maxLength={500} value={note} onChange={e => setNote(e.target.value)} placeholder="Add context for the student…" /><p className="field-hint mb-4">A reason is required when rejecting a request.</p><div className="flex flex-wrap gap-2"><button className="btn btn-primary" disabled={pending} onClick={() => review("APPROVE")}><Check size={14} />Approve</button><button className="btn btn-danger" disabled={pending} onClick={() => review("REJECT")}><X size={14} />Reject</button>{status === "PENDING" && <button className="btn btn-secondary" disabled={pending} onClick={() => review("ESCALATE")}><ArrowUpRight size={14} />Escalate</button>}</div></div>;
}
