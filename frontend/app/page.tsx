import Link from "next/link";
import { getArticles, getCompanies, getEvents, getProducts } from "@/lib/api";

const sections = [
  { href: "/companies", label: "Companies", tone: "bg-teal" },
  { href: "/products", label: "Products", tone: "bg-saffron" },
  { href: "/articles", label: "Articles", tone: "bg-berry" },
  { href: "/events", label: "Events", tone: "bg-ink" },
];

export default async function Home() {
  const [companies, products, articles, events] = await Promise.all([
    getCompanies(),
    getProducts(),
    getArticles(),
    getEvents(),
  ]);

  const counts = [companies.length, products.length, articles.length, events.length];

  return (
    <div className="space-y-10">
      <section className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-teal">Live directory</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-normal text-ink sm:text-5xl">
            B2B Directory
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink/70">
            Browse companies, products, articles, and events served directly from the Django REST API.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sections.map((section, index) => (
            <Link key={section.href} href={section.href} className="border border-line bg-white p-4 shadow-panel transition hover:-translate-y-0.5 hover:border-teal">
              <span className={`mb-4 block h-1.5 w-10 ${section.tone}`} />
              <span className="block text-2xl font-bold text-ink">{counts[index]}</span>
              <span className="mt-1 block text-sm text-ink/65">{section.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="border border-line bg-white px-5 py-5 text-sm font-semibold text-ink shadow-panel transition hover:border-teal hover:text-teal">
            View {section.label}
          </Link>
        ))}
      </section>
    </div>
  );
}
