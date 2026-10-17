"use client";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, X, Search } from "lucide-react";
import { toast } from "sonner";
import { saveUser, saveHospital } from "@/lib/actions/admin";
import { EmptyState, initials } from "./ui";
export type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  hint?: string;
};
export function RecordEditor({
  kind,
  records,
  fields,
}: {
  kind: "user" | "hospital";
  records: Record<string, string | number | boolean | null>[];
  fields: Field[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [record, setRecord] = useState<Record<string, string | number | boolean | null> | null>(
    null,
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const matching = records.filter((r) =>
    `${r.name} ${r.email ?? r.address ?? ""} ${r.role ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(matching.length / 10));
  const visible = matching.slice((page - 1) * 10, page * 10);
  function open(value: typeof record) {
    setRecord(value);
    setError("");
    dialog.current?.showModal();
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form);
    for (const field of fields)
      if (field.type === "checkbox") data[field.name] = form.has(field.name);
    if (record) data.id = record.id;
    startTransition(async () => {
      try {
        const result = await (kind === "user" ? saveUser(data) : saveHospital(data));
        if (!result.success) {
          setError(result.error);
          return;
        }
        toast.success(`${kind === "user" ? "Account" : "Hospital"} saved`);
        dialog.current?.close();
        router.refresh();
      } catch {
        setError("Unable to save. Please try again.");
      }
    });
  }
  return (
    <>
      <div className="card overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative sm:w-80">
            <label htmlFor="record-search" className="sr-only">
              Search {kind === "user" ? "people" : "hospitals"}
            </label>
            <Search size={15} className="absolute left-3 top-3.5 muted" />
            <input
              id="record-search"
              className="input !pl-9"
              placeholder={kind === "user" ? "Search name, email, or role…" : "Search hospitals…"}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => open(null)}>
            <Plus size={15} />
            Add {kind === "user" ? "person" : "hospital"}
          </button>
        </div>
        {!matching.length ? (
          <EmptyState
            title="No matching records"
            description="Add a record or try another search."
          />
        ) : (
          <div className="table-wrap">
            <table>
              <caption className="sr-only">
                {kind === "user" ? "People and access" : "Hospital registry"}
              </caption>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>{kind === "user" ? "Email" : "Address"}</th>
                  <th>{kind === "user" ? "Role" : "Distance"}</th>
                  <th>Status</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={String(r.id)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="avatar">{initials(String(r.name))}</span>
                        <span className="font-medium min-w-28">{r.name}</span>
                      </div>
                    </td>
                    <td className="muted max-w-72">{kind === "user" ? r.email : r.address}</td>
                    <td className="capitalize text-xs">
                      {kind === "user" ? String(r.role).toLowerCase() : `~${r.distanceKm} km`}
                    </td>
                    <td>
                      <span className={`badge ${r.isActive ? "badge-approved" : "badge-rejected"}`}>
                        {r.isActive ? "Active" : kind === "hospital" ? "Archived" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="icon-btn !w-8 !h-8"
                        aria-label={`Edit ${r.name}`}
                        onClick={() => open(r)}
                      >
                        <Pencil size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-5 border-t flex justify-between items-center text-xs muted">
          <span>
            {matching.length} records · page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              className="btn btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-secondary"
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="modal"
        aria-labelledby="editor-title"
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <div className="section-heading">
          <h2 id="editor-title">
            {record ? "Edit" : "Add"} {kind === "user" ? "person" : "hospital"}
          </h2>
          <button
            className="icon-btn"
            disabled={pending}
            aria-label="Close editor"
            onClick={() => dialog.current?.close()}
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} key={record ? String(record.id) : "new"} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              {field.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    name={field.name}
                    defaultChecked={
                      record ? Boolean(record[field.name]) : field.name === "isActive"
                    }
                  />
                  {field.label}
                </label>
              ) : (
                <>
                  <label className="label" htmlFor={`edit-${field.name}`}>
                    {field.label}
                  </label>
                  {field.options ? (
                    <select
                      id={`edit-${field.name}`}
                      name={field.name}
                      className="input"
                      required={field.required}
                      defaultValue={String(record?.[field.name] ?? field.options[0]?.value ?? "")}
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`edit-${field.name}`}
                      name={field.name}
                      className="input"
                      type={field.type ?? "text"}
                      required={field.name === "password" ? !record : field.required}
                      defaultValue={
                        field.name === "password" ? "" : String(record?.[field.name] ?? "")
                      }
                      autoComplete={field.name === "password" ? "new-password" : "off"}
                      step={field.type === "number" ? "0.1" : undefined}
                    />
                  )}
                </>
              )}
              {field.hint && <p className="field-hint">{field.hint}</p>}
            </div>
          ))}
          {error && (
            <p className="notice notice-warning" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={pending}
              onClick={() => dialog.current?.close()}
            >
              Cancel
            </button>
            <button className="btn btn-primary" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
