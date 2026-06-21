import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { SearchForm } from "@/components/search-form";
import { getCategories, getCompanies } from "@/lib/api";

type CompaniesPageProps = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const { category = "", search = "" } = await searchParams;
  const query = search.trim();
  const categoryFilter = category.trim();
  const [categories, companies] = await Promise.all([
    getCategories(),
    getCompanies({ category: categoryFilter, search: query }),
  ]);

  return (
    <div>
      <PageIntro eyebrow="Companies" title="Company directory" description="Explore supplier and partner profiles from the Django companies endpoint." />
      <SearchForm action="/companies" defaultValue={query} hiddenFields={{ category: categoryFilter }} placeholder="Search companies by name, description, email, or website" />
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/companies" className={`border px-3 py-2 text-sm font-semibold transition ${categoryFilter ? "border-line text-ink/70 hover:border-teal hover:text-teal" : "border-teal bg-teal text-white"}`}>
          All categories
        </Link>
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`/companies?category=${item.slug}`}
            className={`border px-3 py-2 text-sm font-semibold transition ${categoryFilter === item.slug ? "border-teal bg-teal text-white" : "border-line text-ink/70 hover:border-teal hover:text-teal"}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      {companies.length === 0 ? (
        <EmptyState
          title={query || categoryFilter ? "No companies found" : "No companies yet"}
          message={query || categoryFilter ? "Try a different company search or category filter." : "Add companies in Django admin and they will appear here automatically."}
        />
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
              {company.category_slug ? (
                <Link href={`/companies?category=${company.category_slug}`} className="mt-4 inline-flex text-xs font-semibold uppercase tracking-normal text-teal transition hover:text-ink">
                  {company.category_name}
                </Link>
              ) : null}
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
