import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { RFQBoard } from "@/components/rfq-board";
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
      <RFQBoard rfqs={rfqs} />
    </div>
  );
}
