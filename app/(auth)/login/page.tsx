import { Activity, ArrowUpRight, ShieldCheck, Check, HeartPulse } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
export const metadata = {
  title: "Sign in",
  description:
    "CampusCare connects IIT Madras students with timely hospital visit authorization and care.",
};
export default function LoginPage() {
  return (
    <main id="main-content" className="login-grid">
      <section className="login-story">
        <div className="brand">
          <span className="brand-mark">
            <Activity size={23} />
          </span>
          CampusCare.
        </div>
        <div className="relative z-10 py-16">
          <div className="eyebrow !text-[#b6d5c0] mb-6">
            A little less paperwork. A lot more care.
          </div>
          <h1 className="!text-5xl xl:!text-6xl leading-[1.1] max-w-lg">
            Your wellbeing.
            <br />
            <span className="text-[#c8edaf]">Our shared priority.</span>
          </h1>
          <p className="text-[#b9d0c2] text-sm leading-7 mt-6 max-w-sm">
            From campus to care, we keep your hospital visits simple, your proctor informed, and
            your family connected.
          </p>
          <div className="mt-10 space-y-4">
            {[
              "One request. A clear path to approval.",
              "Emergency requests get timely attention.",
              "Every update, in one secure place.",
            ].map((t) => (
              <div className="flex gap-3 items-center text-xs" key={t}>
                <span className="rounded-full bg-white/10 p-1.5">
                  <Check size={13} className="text-[#c8edaf]" />
                </span>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-[#b9d0c2]">
          <span>IIT Madras · Student wellbeing</span>
          <HeartPulse size={18} />
        </div>
        <div className="hero-orbit !w-[500px] !h-[500px] !-right-64 !top-64 opacity-50" />
      </section>
      <section className="flex items-center justify-center p-7 sm:p-12 min-h-screen">
        <div className="w-full max-w-[360px]">
          <div className="mobile-only brand mb-14">
            <span className="brand-mark">
              <Activity size={23} />
            </span>
            CampusCare.
          </div>
          <div className="inline-flex gap-2 items-center text-[10px] font-semibold tracking-wider uppercase accent mb-5">
            <ShieldCheck size={14} />
            Your secure campus workspace
          </div>
          <h1 className="!text-3xl">Welcome back.</h1>
          <p className="muted text-sm mt-3 mb-9 leading-relaxed">
            Sign in to take the next step in your care.
          </p>
          <LoginForm />
          <div className="mt-10 pt-6 border-t flex items-center justify-between text-[10px] muted">
            <span>Made for the IIT Madras community</span>
            <ArrowUpRight size={15} />
          </div>
        </div>
      </section>
    </main>
  );
}
