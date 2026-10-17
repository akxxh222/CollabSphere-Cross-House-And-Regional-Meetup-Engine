import Link from "next/link";
import { Network, Check, ArrowUpRight, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
export const metadata = { title: "Sign in" };
export default function Page() {
  return (
    <main id="main-content" className="login-grid">
      <section className="login-story">
        <div className="brand">
          <span className="brand-mark">
            <Network size={23} />
          </span>
          CollabSphere.
        </div>
        <div className="relative z-10 py-16">
          <div className="eyebrow !text-[#b6d5c0] mb-6">
            IIT Madras online degree · regional community
          </div>
          <h1 className="!text-5xl xl:!text-6xl leading-[1.1] max-w-xl">
            Your degree is online.
            <br />
            <span className="text-[#c8edaf]">Your community is everywhere.</span>
          </h1>
          <p className="text-[#b9d0c2] text-sm leading-7 mt-6 max-w-md">
            Discover learners near you, build cross-house meetups, verify participation, and turn
            regional connections into study momentum.
          </p>
          <div className="mt-10 space-y-4">
            {[
              "Interactive map of approved regional meetups",
              "Joint-event hosting across houses and societies",
              "QR proof of presence with activity points",
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
        <div className="text-[11px] text-[#b9d0c2]">Built for the IIT Madras learner network</div>
      </section>
      <section className="flex items-center justify-center p-7 sm:p-12 min-h-screen">
        <div className="w-full max-w-[380px]">
          <div className="inline-flex gap-2 items-center text-[10px] font-semibold tracking-wider uppercase accent mb-5">
            <ShieldCheck size={14} />
            Approved members only
          </div>
          <h1 className="!text-3xl">Welcome back.</h1>
          <p className="muted text-sm mt-3 mb-9">Sign in to your regional community workspace.</p>
          <LoginForm />
          <div className="mt-8 pt-6 border-t text-xs text-center">
            <span className="muted">New learner? </span>
            <Link className="accent font-semibold inline-flex items-center gap-1" href="/signup">
              Request access <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
