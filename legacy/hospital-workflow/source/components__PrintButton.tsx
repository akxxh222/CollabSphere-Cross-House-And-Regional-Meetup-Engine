"use client";
import { Printer } from "lucide-react";
export function PrintButton() {
  return (
    <button className="btn btn-secondary no-print" onClick={() => window.print()}>
      <Printer size={14} />
      Print pass
    </button>
  );
}
