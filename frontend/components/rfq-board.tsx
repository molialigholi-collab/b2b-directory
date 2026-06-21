"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { RFQ } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getMyCompany, respondToRFQ } from "@/lib/dashboard";

type RFQBoardProps = {
  rfqs: RFQ[];
};

type ResponseFormState = {
  message: string;
  proposed_price: string;
  currency: string;
  delivery_time: string;
};

const emptyResponseForm: ResponseFormState = {
  message: "",
  proposed_price: "",
  currency: "",
  delivery_time: "",
};

export function RFQBoard({ rfqs }: RFQBoardProps) {
  const [canRespond, setCanRespond] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [openRFQId, setOpenRFQId] = useState<number | null>(null);
  const [form, setForm] = useState<ResponseFormState>(emptyResponseForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOwnerState() {
      const user = await getCurrentUser();

      if (!user) {
        return;
      }

      try {
        const response = await getMyCompany();
        setCanRespond(Boolean(response.company));
        setCompanyName(response.company?.name || "");
      } catch {
        setCanRespond(false);
      }
    }

    loadOwnerState();
  }, []);

  function openForm(rfqId: number) {
    setOpenRFQId(rfqId);
    setForm(emptyResponseForm);
    setMessage("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>, rfqId: number) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      await respondToRFQ(rfqId, {
        message: form.message.trim(),
        proposed_price: form.proposed_price.trim() || undefined,
        currency: form.currency.trim() || undefined,
        delivery_time: form.delivery_time.trim() || undefined,
      });
      setMessage("RFQ response submitted.");
      setOpenRFQId(null);
      setForm(emptyResponseForm);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit RFQ response.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (rfqs.length === 0) {
    return <EmptyState title="No public RFQs yet" message="Submitted RFQs appear here after admin review." />;
  }

  return (
    <div className="space-y-4">
      {companyName ? <p className="text-sm text-ink/65">Signed in supplier: <span className="font-semibold text-ink">{companyName}</span></p> : null}
      {message ? <p className="border border-teal bg-white p-3 text-sm font-medium text-teal shadow-panel">{message}</p> : null}
      {error ? <p className="border border-berry bg-white p-3 text-sm font-medium text-berry shadow-panel">{error}</p> : null}

      <div className="grid gap-4">
        {rfqs.map((rfq) => (
          <article key={rfq.id} className="border border-line bg-white p-5 shadow-panel">
            <div className="flex flex-wrap gap-2">
              <span className="border border-line px-2 py-1 text-xs font-semibold uppercase tracking-normal text-ink/60">{rfq.status}</span>
              {rfq.category_name ? <span className="border border-teal px-2 py-1 text-xs font-semibold uppercase tracking-normal text-teal">{rfq.category_name}</span> : null}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-ink">{rfq.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">{rfq.description}</p>
            <dl className="mt-5 grid gap-3 text-sm text-ink/65 md:grid-cols-3">
              <div>
                <dt className="font-semibold text-ink">Quantity</dt>
                <dd>{rfq.quantity} {rfq.unit}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Destination</dt>
                <dd>{[rfq.destination_city, rfq.destination_country].filter(Boolean).join(", ")}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Posted</dt>
                <dd>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(rfq.created_at))}</dd>
              </div>
            </dl>

            {canRespond ? (
              <div className="mt-5">
                {openRFQId === rfq.id ? (
                  <form onSubmit={(event) => handleSubmit(event, rfq.id)} className="grid gap-4 border-t border-line pt-5">
                    <label className="grid gap-2 text-sm font-semibold text-ink">
                      Response message
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(event) => setForm({ ...form, message: event.target.value })}
                        className="border border-line bg-paper px-3 py-3 font-normal outline-none focus:border-teal"
                      />
                    </label>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="Proposed price" name="proposed_price" value={form.proposed_price} onChange={(value) => setForm({ ...form, proposed_price: value })} />
                      <Field label="Currency" name="currency" value={form.currency} onChange={(value) => setForm({ ...form, currency: value })} />
                      <Field label="Delivery time" name="delivery_time" value={form.delivery_time} onChange={(value) => setForm({ ...form, delivery_time: value })} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="submit" disabled={isSubmitting} className="min-h-11 border border-teal bg-teal px-5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60">
                        {isSubmitting ? "Submitting..." : "Submit Response"}
                      </button>
                      <button type="button" onClick={() => setOpenRFQId(null)} className="min-h-11 border border-line px-5 text-sm font-semibold text-ink transition hover:border-berry hover:text-berry">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button type="button" onClick={() => openForm(rfq.id)} className="min-h-11 border border-teal bg-teal px-5 text-sm font-semibold text-white transition hover:bg-ink">
                    Respond to RFQ
                  </button>
                )}
              </div>
            ) : (
              <p className="mt-5 text-sm text-ink/60">
                <Link href="/login" className="font-semibold text-teal transition hover:text-ink">Login</Link> with a company owner account to respond.
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function Field({ label, name, onChange, value }: { label: string; name: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input name={name} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 border border-line bg-paper px-3 font-normal outline-none focus:border-teal" />
    </label>
  );
}
