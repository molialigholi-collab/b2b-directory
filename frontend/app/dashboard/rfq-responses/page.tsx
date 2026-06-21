"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getMyRFQResponses, RFQResponse } from "@/lib/dashboard";

export default function DashboardRFQResponsesPage() {
  const [responses, setResponses] = useState<RFQResponse[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function loadResponses() {
      const user = await getCurrentUser();
      setIsLoggedIn(Boolean(user));

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getMyRFQResponses();
        setResponses(response.responses);
        setCompanyName(response.company?.name || "");
        setDetail(response.detail || "");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load RFQ responses.");
      } finally {
        setIsLoading(false);
      }
    }

    loadResponses();
  }, []);

  if (isLoading) {
    return <div className="border border-line bg-white p-6 text-sm text-ink/65 shadow-panel">Loading RFQ responses...</div>;
  }

  if (!isLoggedIn) {
    return <LoginRequired />;
  }

  if (!companyName && detail) {
    return (
      <div className="mx-auto max-w-2xl border border-line bg-white p-6 shadow-panel">
        <h1 className="text-3xl font-bold tracking-normal text-ink">RFQ Responses</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">{detail}</p>
        <BackLink />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BackLink />
      <section className="border-b border-line pb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-teal">Supplier RFQs</p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal text-ink sm:text-4xl">RFQ Responses</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">Submitted responses for {companyName || "your company"}.</p>
      </section>

      {error ? <p className="border border-berry bg-white p-3 text-sm font-medium text-berry shadow-panel">{error}</p> : null}

      <section className="grid gap-4">
        {responses.length ? (
          responses.map((response) => (
            <article key={response.id} className="border border-line bg-white p-5 shadow-panel">
              <div className="flex flex-wrap gap-2">
                <span className="border border-line px-2 py-1 text-xs font-semibold uppercase tracking-normal text-ink/60">{response.status}</span>
                <span className="border border-teal px-2 py-1 text-xs font-semibold uppercase tracking-normal text-teal">{response.rfq_status}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-ink">{response.rfq_title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">{response.message}</p>
              <dl className="mt-5 grid gap-3 text-sm text-ink/65 md:grid-cols-3">
                <div>
                  <dt className="font-semibold text-ink">Price</dt>
                  <dd>{response.proposed_price ? `${response.proposed_price} ${response.currency || ""}`.trim() : "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Delivery Time</dt>
                  <dd>{response.delivery_time || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Submitted</dt>
                  <dd>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(response.created_at))}</dd>
                </div>
              </dl>
            </article>
          ))
        ) : (
          <div className="border border-dashed border-line bg-white p-5 text-sm text-ink/65 shadow-panel">No RFQ responses submitted yet.</div>
        )}
      </section>
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/dashboard" className="inline-flex text-sm font-semibold text-teal transition hover:text-ink">
      Back to dashboard
    </Link>
  );
}

function LoginRequired() {
  return (
    <div className="mx-auto max-w-xl border border-line bg-white p-6 shadow-panel">
      <h1 className="text-3xl font-bold tracking-normal text-ink">Login Required</h1>
      <p className="mt-3 text-sm leading-6 text-ink/65">Login to view your RFQ responses.</p>
      <Link href="/login" className="mt-5 inline-flex border border-teal bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink">
        Login
      </Link>
    </div>
  );
}
