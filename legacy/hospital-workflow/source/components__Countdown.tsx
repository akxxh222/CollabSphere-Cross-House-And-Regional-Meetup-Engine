"use client";
import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
export function Countdown({ createdAt, timeout }: { createdAt: string; timeout: number }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const tick = () =>
      setRemaining(Math.max(0, new Date(createdAt).getTime() + timeout - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [createdAt, timeout]);
  const seconds = Math.ceil((remaining ?? timeout) / 1000);
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] ${seconds < 60 ? "text-red-700 dark:text-red-300 urgent-pulse" : "muted"}`}
      title="Emergency review deadline"
    >
      <Timer size={12} />
      {remaining === null
        ? "Calculating…"
        : seconds === 0
          ? "Escalation due"
          : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} to escalate`}
    </span>
  );
}
