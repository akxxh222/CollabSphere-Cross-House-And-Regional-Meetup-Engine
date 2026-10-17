import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to CampusCare to manage hospital visit requests.",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md animate-in">
      {/* Logo + Title */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style={{ background: "linear-gradient(135deg, hsl(220,80%,52%), hsl(250,80%,60%))" }}
          aria-hidden="true"
        >
          <span className="text-2xl">🏥</span>
        </div>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          CampusCare
        </h1>
        <p className="text-sm mt-2" style={{ color: "hsl(220,20%,65%)" }}>
          IITM Hospital Visit Authorization System
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <h2 className="text-lg font-semibold text-white mb-6">
          Sign in to your account
        </h2>
        <LoginForm />
      </div>

      <p className="text-center mt-6 text-xs" style={{ color: "hsl(220,15%,50%)" }}>
        Only @iitm.ac.in email addresses are accepted.
      </p>
    </div>
  );
}
