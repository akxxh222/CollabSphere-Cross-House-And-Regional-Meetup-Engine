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
    const form = new FormData(e.currentTarget);
    const result = loginSchema.safeParse(Object.fromEntries(form));
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const response = await signIn("credentials", { ...result.data, redirect: false });
      if (response?.error || !response?.ok) {
        setError(
          "Unable to sign in. Check your details, or try again later if you have made several attempts.",
        );
      } else {
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
          className="input"
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="you@iitm.ac.in"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            className="input pr-12"
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            minLength={6}
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
      <button className="btn btn-primary w-full !py-3" disabled={loading} aria-busy={loading}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Signing in…" : "Sign in to your workspace"}
        <ArrowRight size={16} />
      </button>
      <p className="text-[11px] muted text-center leading-relaxed">
        Need access? Contact your campus administrator.
        <br />
        Parents can use their registered personal email.
      </p>
    </form>
  );
}
