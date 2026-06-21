"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Category, createRFQ, getCategories } from "@/lib/api";

export default function RFQPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const description = String(formData.get("description") || "").trim();
    const title = String(formData.get("title") || "").trim();

    if (title.length < 3 || description.length < 20) {
      setStatus("error");
      setMessage("Please provide a title and a description of at least 20 characters.");
      return;
    }

    try {
      await createRFQ({
        buyer_email: String(formData.get("buyer_email") || "").trim(),
        buyer_name: String(formData.get("buyer_name") || "").trim(),
        buyer_phone: String(formData.get("buyer_phone") || "").trim(),
        category: Number(formData.get("category")) || null,
        description,
        destination_city: String(formData.get("destination_city") || "").trim(),
        destination_country: String(formData.get("destination_country") || "").trim(),
        quantity: Number(formData.get("quantity")) || 0,
        title,
        unit: String(formData.get("unit") || "").trim(),
      });

      event.currentTarget.reset();
      setStatus("success");
      setMessage("RFQ submitted successfully. Admin will review it before it appears publicly.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit RFQ.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section className="border-b border-line pb-8">
        <p className="text-sm font-semibold uppercase tracking-normal text-teal">Request for quote</p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal text-ink sm:text-4xl">Submit an RFQ</h1>
        <p className="mt-4 text-sm leading-6 text-ink/65">Share your sourcing request. Buyer contact details stay private and are only visible to admins.</p>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-4 border border-line bg-white p-6 shadow-panel">
        <Field name="title" label="RFQ title" required />
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Category
          <select name="category" className="min-h-11 border border-line bg-paper px-3 font-normal outline-none focus:border-teal">
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Description
          <textarea name="description" required minLength={20} rows={6} className="border border-line bg-paper px-3 py-3 font-normal outline-none focus:border-teal" />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="quantity" label="Quantity" type="number" required />
          <Field name="unit" label="Unit" required />
          <Field name="destination_country" label="Destination country" required />
          <Field name="destination_city" label="Destination city" />
          <Field name="buyer_name" label="Buyer name" required />
          <Field name="buyer_email" label="Buyer email" type="email" required />
          <Field name="buyer_phone" label="Buyer phone" />
        </div>
        <button type="submit" disabled={status === "submitting"} className="min-h-11 border border-teal bg-teal px-5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60">
          {status === "submitting" ? "Submitting..." : "Submit RFQ"}
        </button>
        {message ? <p className={`text-sm font-medium ${status === "success" ? "text-teal" : "text-berry"}`}>{message}</p> : null}
        <p className="text-xs leading-5 text-ink/50">Production note: add captcha and rate-limit protection before opening high-volume public RFQ submissions.</p>
      </form>

      <Link href="/rfqs" className="inline-flex text-sm font-semibold text-teal transition hover:text-ink">
        View public RFQs
      </Link>
    </div>
  );
}

function Field({ label, name, required = false, type = "text" }: { label: string; name: string; required?: boolean; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input name={name} type={type} required={required} className="min-h-11 border border-line bg-paper px-3 font-normal outline-none focus:border-teal" />
    </label>
  );
}
