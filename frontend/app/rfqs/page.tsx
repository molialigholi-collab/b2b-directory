import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { getRFQs } from "@/lib/api";

export default async function RFQsPage() {
  const rfqs = await getRFQs();

  return (
    <div>
      <PageIntro eyebrow="RFQs" title="Public RFQ board" description="Reviewed and matched buyer requests. Buyer contact details are kept private." />
      <div className="mb-6">
        <Link href="/rfq" className="inline-flex border border-teal bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink">
          Submit RFQ
        </Link>
      </div>
      {rfqs.length === 0 ? (
        <EmptyState title="No public RFQs yet" message="Submitted RFQs appear here after admin review." />
      ) : (
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
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
