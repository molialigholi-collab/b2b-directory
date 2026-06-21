import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { getCompanies } from "@/lib/api";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div>
      <PageIntro eyebrow="Companies" title="Company directory" description="Explore supplier and partner profiles from the Django companies endpoint." />
      {companies.length === 0 ? (
        <EmptyState title="No companies yet" message="Add companies in Django admin and they will appear here automatically." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {companies.map((company) => (
            <article key={company.id} className="border border-line bg-white p-5 shadow-panel transition hover:border-teal">
              <h2 className="text-xl font-semibold text-ink">
                <Link href={`/companies/${company.slug}`} className="transition hover:text-teal">
                  {company.name}
                </Link>
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/70">{company.description || "No description provided."}</p>
              <dl className="mt-5 grid gap-2 text-sm text-ink/65">
                <div><dt className="font-semibold text-ink">Email</dt><dd>{company.email || "Not listed"}</dd></div>
                <div><dt className="font-semibold text-ink">Phone</dt><dd>{company.phone || "Not listed"}</dd></div>
                <div><dt className="font-semibold text-ink">Website</dt><dd>{company.website || "Not listed"}</dd></div>
              </dl>
              <Link href={`/companies/${company.slug}`} className="mt-5 inline-flex text-sm font-semibold text-teal transition hover:text-ink">
                View company details
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
