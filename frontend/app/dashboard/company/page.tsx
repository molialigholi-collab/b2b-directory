"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Company } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getMyCompany, updateMyCompany } from "@/lib/dashboard";

export default function DashboardCompanyPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      setIsLoggedIn(Boolean(user));

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getMyCompany();
        setCompany(response.company);
        setDetail(response.detail || "");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load company.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await updateMyCompany({
        name: String(formData.get("name") || "").trim(),
        description: String(formData.get("description") || "").trim(),
        website: String(formData.get("website") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        email: String(formData.get("email") || "").trim(),
      });
      setCompany(response.company);
      setSuccess("Company profile updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update company.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="border border-line bg-white p-6 text-sm text-ink/65 shadow-panel">Loading company dashboard...</div>;
  }

  if (!isLoggedIn) {
    return <LoginRequired />;
  }

  if (!company) {
    return (
      <div className="mx-auto max-w-2xl border border-line bg-white p-6 shadow-panel">
        <h1 className="text-3xl font-bold tracking-normal text-ink">Company Profile</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">{detail || "No company is assigned to this account yet."}</p>
        <Link href="/dashboard" className="mt-5 inline-flex text-sm font-semibold text-teal transition hover:text-ink">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/dashboard" className="inline-flex text-sm font-semibold text-teal transition hover:text-ink">
        Back to dashboard
      </Link>
      <section className="border border-line bg-white p-6 shadow-panel">
        <h1 className="text-3xl font-bold tracking-normal text-ink">Company Profile</h1>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <Field name="name" label="Company name" defaultValue={company.name} required />
          <TextArea name="description" label="Description" defaultValue={company.description} />
          <Field name="website" label="Website" defaultValue={company.website} />
          <Field name="phone" label="Phone" defaultValue={company.phone} />
          <Field name="email" label="Email" type="email" defaultValue={company.email} />
          <button type="submit" disabled={isSaving} className="min-h-11 border border-teal bg-teal px-5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60">
            {isSaving ? "Saving..." : "Save Company"}
          </button>
          {success ? <p className="text-sm font-medium text-teal">{success}</p> : null}
          {error ? <p className="text-sm font-medium text-berry">{error}</p> : null}
        </form>
      </section>
    </div>
  );
}

function LoginRequired() {
  return (
    <div className="mx-auto max-w-xl border border-line bg-white p-6 shadow-panel">
      <h1 className="text-3xl font-bold tracking-normal text-ink">Login Required</h1>
      <p className="mt-3 text-sm leading-6 text-ink/65">Login to manage your company profile.</p>
      <Link href="/login" className="mt-5 inline-flex border border-teal bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink">
        Login
      </Link>
    </div>
  );
}

function Field({ defaultValue, label, name, required = false, type = "text" }: { defaultValue?: string; label: string; name: string; required?: boolean; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input name={name} type={type} required={required} defaultValue={defaultValue || ""} className="min-h-11 border border-line bg-paper px-3 font-normal outline-none focus:border-teal" />
    </label>
  );
}

function TextArea({ defaultValue, label, name }: { defaultValue?: string; label: string; name: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <textarea name={name} rows={6} defaultValue={defaultValue || ""} className="border border-line bg-paper px-3 py-3 font-normal outline-none focus:border-teal" />
    </label>
  );
}
