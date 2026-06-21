import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCompany, getCompanies } from "@/lib/api";
import { absoluteUrl, pageDescription } from "@/lib/seo";

type CompanyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const companies = await getCompanies();
  return companies.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({ params }: CompanyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompany(slug).catch(() => null);

  if (!company) {
    return {
      title: "Company Not Found",
    };
  }

  const description = pageDescription(company.description);

  return {
    title: company.name,
    description,
    alternates: {
      canonical: absoluteUrl(`/companies/${company.slug}`),
    },
    openGraph: {
      title: company.name,
      description,
      url: absoluteUrl(`/companies/${company.slug}`),
      images: company.logo ? [company.logo] : undefined,
    },
  };
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { slug } = await params;
  const company = await getCompany(slug).catch(() => null);

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Link href="/companies" className="inline-flex text-sm font-semibold text-teal transition hover:text-ink">
        Back to companies
      </Link>

      <section className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[180px_1fr]">
        <div className="flex h-40 w-40 items-center justify-center border border-line bg-white text-sm font-semibold text-ink/55 shadow-panel">
          {company.logo ? (
            <img src={company.logo} alt={`${company.name} logo`} className="h-full w-full object-contain p-4" />
          ) : (
            <span>No logo</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-teal">Company profile</p>
          <h1 className="mt-3 text-3xl font-bold tracking-normal text-ink sm:text-4xl">{company.name}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-ink/70">{company.description || "No description provided."}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="border border-line bg-white p-5 shadow-panel">
          <h2 className="text-sm font-semibold uppercase tracking-normal text-ink/60">Website</h2>
          {company.website ? (
            <a href={company.website} className="mt-3 block break-words text-sm font-semibold text-teal hover:text-ink" target="_blank" rel="noreferrer">
              {company.website}
            </a>
          ) : (
            <p className="mt-3 text-sm text-ink/65">Not listed</p>
          )}
        </div>
        <div className="border border-line bg-white p-5 shadow-panel">
          <h2 className="text-sm font-semibold uppercase tracking-normal text-ink/60">Phone</h2>
          <p className="mt-3 text-sm text-ink/75">{company.phone || "Not listed"}</p>
        </div>
        <div className="border border-line bg-white p-5 shadow-panel">
          <h2 className="text-sm font-semibold uppercase tracking-normal text-ink/60">Email</h2>
          {company.email ? (
            <a href={`mailto:${company.email}`} className="mt-3 block break-words text-sm font-semibold text-teal hover:text-ink">
              {company.email}
            </a>
          ) : (
            <p className="mt-3 text-sm text-ink/65">Not listed</p>
          )}
        </div>
      </section>
    </div>
  );
}
