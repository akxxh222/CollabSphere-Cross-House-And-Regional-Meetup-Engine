"use client";
import { useTransition } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { processNotifications } from "@/lib/actions/admin";
export function NotificationControls() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      className="btn btn-primary"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await processNotifications();
          if (result.success) toast.success(`${result.count} queued notifications processed`);
          else toast.error(result.error);
        })
      }
    >
      <Send size={14} />
      {pending ? "Processing…" : "Process queue"}
    </button>
  );
}
