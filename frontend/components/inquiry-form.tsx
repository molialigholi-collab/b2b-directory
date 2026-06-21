"use client";

import { FormEvent, useState } from "react";
import { createInquiry } from "@/lib/api";

type InquiryFormProps = {
  companyId?: number;
  productId?: number;
  sourcePage: string;
  title: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

export function InquiryForm({ companyId, productId, sourcePage, title }: InquiryFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const inquiryMessage = String(formData.get("message") || "").trim();

    if (name.length < 2 || !email || inquiryMessage.length < 10) {
      setStatus("error");
      setMessage("Please provide your name, email, and a message of at least 10 characters.");
      return;
    }

    try {
      await createInquiry({
        ...(companyId ? { company: companyId } : {}),
        ...(productId ? { product: productId } : {}),
        name,
        email,
        phone,
        message: inquiryMessage,
        source_page: sourcePage,
      });

      event.currentTarget.reset();
      setStatus("success");
      setMessage("Your inquiry was sent successfully. The team can follow up from the admin dashboard.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send inquiry. Please try again.");
    }
  }

  return (
    <section className="border border-line bg-white p-5 shadow-panel">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink/65">
        Send a direct inquiry. Login is not required yet.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Name
          <input name="name" required minLength={2} className="min-h-11 border border-line bg-paper px-3 font-normal outline-none focus:border-teal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Email
          <input name="email" type="email" required className="min-h-11 border border-line bg-paper px-3 font-normal outline-none focus:border-teal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Phone
          <input name="phone" className="min-h-11 border border-line bg-paper px-3 font-normal outline-none focus:border-teal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Message
          <textarea name="message" required minLength={10} rows={5} className="border border-line bg-paper px-3 py-3 font-normal outline-none focus:border-teal" />
        </label>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="min-h-11 border border-teal bg-teal px-5 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : "Send Inquiry"}
        </button>
        {message ? (
          <p className={`text-sm font-medium ${status === "success" ? "text-teal" : "text-berry"}`}>{message}</p>
        ) : null}
      </form>
      <p className="mt-4 text-xs leading-5 text-ink/50">
        Production note: add captcha and rate-limit protection before opening high-volume public traffic.
      </p>
    </section>
  );
}
