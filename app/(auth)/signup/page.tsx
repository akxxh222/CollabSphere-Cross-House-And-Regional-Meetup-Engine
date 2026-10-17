import Link from "next/link";
import { Network, ArrowLeft } from "lucide-react";
import { SignupForm } from "@/components/CommunityForms";
export const metadata = { title: "Request membership" };
export default function Page() {
  return (
    <main id="main-content" className="min-h-screen grid lg:grid-cols-[.6fr_1fr]">
      <aside className="login-story min-h-[320px] lg:min-h-screen">
        <Link href="/login" className="brand">
          <span className="brand-mark">
            <Network size={23} />
          </span>
          CollabSphere.
        </Link>
        <div className="my-auto py-14">
          <p className="eyebrow !text-[#b6d5c0]">Trusted community access</p>
          <h1 className="!text-4xl mt-4">Join learners in your region.</h1>
          <p className="text-[#b9d0c2] leading-7 mt-5 max-w-sm">
            Every application is reviewed by an admin. Use your IIT Madras email and learner details
            so the community stays useful and trusted.
          </p>
        </div>
      </aside>
      <section className="p-7 sm:p-12 lg:p-20 flex items-center">
        <div className="w-full max-w-3xl mx-auto">
          <Link href="/login" className="text-xs muted flex gap-2 items-center mb-8">
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
          <h1>Request membership</h1>
          <p className="muted text-sm mt-3 mb-8">
            Student accounts become active after admin approval.
          </p>
          <SignupForm />
        </div>
      </section>
    </main>
  );
}
