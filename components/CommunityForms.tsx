"use client";
import { useActionState } from "react";
import { createEventAction, signupAction, type FormResult } from "@/lib/actions/community";
const initial: FormResult = { ok: false, message: "" };
export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, initial);
  return (
    <form action={action} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Field name="name" label="Full name" />
        <Field name="email" label="IIT Madras email" type="email" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field name="registerNo" label="Learner ID / roll number" />
        <Field name="password" label="Password" type="password" />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Field name="studyProgram" label="Study program" placeholder="BS Data Science" />
        <Field name="region" label="Region" placeholder="South" />
        <Field name="city" label="City" placeholder="Chennai" />
      </div>
      {state.message && (
        <p role="status" className={`notice ${state.ok ? "notice-success" : "notice-warning"}`}>
          {state.message}
        </p>
      )}
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Submitting…" : "Request membership"}
      </button>
    </form>
  );
}
export function EventForm({
  coordinators,
}: {
  coordinators: { id: string; name: string; house: string | null }[];
}) {
  const [state, action, pending] = useActionState(createEventAction, initial);
  return (
    <form action={action} className="card card-pad space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <Field name="title" label="Event title" />
        <Select
          name="type"
          label="Format"
          options={["MEETUP", "COWORKING", "STUDY_CIRCLE", "WORKSHOP", "SOCIAL"]}
        />
      </div>
      <label className="block">
        <span className="label">Description</span>
        <textarea
          className="input min-h-28"
          name="description"
          required
          placeholder="What learners will do, bring, and take away…"
        />
      </label>
      <div className="grid md:grid-cols-2 gap-4">
        <Field name="region" label="Region" />
        <Field name="city" label="City" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field name="venue" label="Venue" />
        <Field name="address" label="Full address" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field name="latitude" label="Latitude" type="number" />
        <Field name="longitude" label="Longitude" type="number" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field name="startsAt" label="Starts" type="datetime-local" />
        <Field name="endsAt" label="Ends" type="datetime-local" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field name="capacity" label="Capacity" type="number" />
        <Field name="points" label="Activity points" type="number" />
      </div>
      {coordinators.length > 0 && (
        <label className="block">
          <span className="label">Joint hosts</span>
          <select className="input min-h-28" name="coHostIds" multiple>
            {coordinators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.house ? ` · ${c.house}` : ""}
              </option>
            ))}
          </select>
        </label>
      )}
      {state.message && (
        <p role="status" className={`notice ${state.ok ? "notice-success" : "notice-warning"}`}>
          {state.message}
        </p>
      )}
      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Saving…" : "Create meetup"}
      </button>
    </form>
  );
}
function Field({
  name,
  label,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        className="input"
        name={name}
        type={type}
        placeholder={placeholder}
        required
        step={type === "number" ? "any" : undefined}
      />
    </label>
  );
}
function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select className="input" name={name}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
