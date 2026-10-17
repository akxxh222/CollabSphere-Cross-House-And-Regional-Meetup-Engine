"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginInput } from "@/lib/validations";

// ─────────────────────────────────────────────
// Login Form (Client Component)
// ─────────────────────────────────────────────
export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginInput>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setServerError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<LoginInput> = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setServerError("Invalid email or password. Please try again.");
      return;
    }

    // Successful login — root page handles role-based redirect
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Login form">
      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="label" style={{ color: "hsl(220,20%,70%)" }}>
          IITM Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder="student@iitm.ac.in"
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
          style={{
            width: "100%",
            padding: "0.625rem 0.875rem",
            borderRadius: "0.625rem",
            border: `1px solid ${errors.email ? "hsl(0,72%,52%)" : "rgba(255,255,255,0.15)"}`,
            background: "rgba(255,255,255,0.07)",
            color: "white",
            fontSize: "0.875rem",
            outline: "none",
          }}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-xs" style={{ color: "hsl(0,80%,70%)" }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="mb-6">
        <label htmlFor="password" className="label" style={{ color: "hsl(220,20%,70%)" }}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          aria-describedby={errors.password ? "password-error" : undefined}
          aria-invalid={!!errors.password}
          style={{
            width: "100%",
            padding: "0.625rem 0.875rem",
            borderRadius: "0.625rem",
            border: `1px solid ${errors.password ? "hsl(0,72%,52%)" : "rgba(255,255,255,0.15)"}`,
            background: "rgba(255,255,255,0.07)",
            color: "white",
            fontSize: "0.875rem",
            outline: "none",
          }}
        />
        {errors.password && (
          <p id="password-error" role="alert" className="mt-1 text-xs" style={{ color: "hsl(0,80%,70%)" }}>
            {errors.password}
          </p>
        )}
      </div>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="mb-4 px-4 py-3 rounded-lg text-sm"
          style={{ background: "hsl(0,60%,20%)", color: "hsl(0,80%,75%)", border: "1px solid hsl(0,50%,35%)" }}
        >
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        id="login-submit"
        type="submit"
        disabled={loading}
        aria-busy={loading}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "0.625rem",
          border: "none",
          background: "linear-gradient(135deg, hsl(220,80%,52%), hsl(250,80%,60%))",
          color: "white",
          fontWeight: 600,
          fontSize: "0.9375rem",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "opacity 0.15s",
        }}
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
