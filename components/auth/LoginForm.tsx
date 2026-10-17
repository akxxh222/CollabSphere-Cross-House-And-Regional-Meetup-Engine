"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { loginSchema } from "@/lib/validations";
export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const parsed = loginSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const response = await signIn("credentials", { ...parsed.data, redirect: false });
      if (response?.error || !response?.ok)
        setError(
          "Unable to sign in. Check your details and make sure an admin approved your account.",
        );
      else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Cannot reach the sign-in service. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          className="input"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="you@ds.study.iitm.ac.in"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            className="input pr-12"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            minLength={8}
          />
          <button
            type="button"
            className="absolute right-3 top-3 muted"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="notice notice-warning">
          {error}
        </p>
      )}
      <button className="btn btn-primary w-full !py-3" disabled={loading}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Signing in…" : "Sign in to your workspace"}
        <ArrowRight size={16} />
      </button>
      <p className="text-[11px] muted text-center">
        Pending applications cannot sign in until an admin approves them.
      </p>
    </form>
  );
}
