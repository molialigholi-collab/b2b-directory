import Link from "next/link";
import { getArticles, getCategories, getCompanies, getEvents, getProducts } from "@/lib/api";

function latestByCreatedAt<T extends { created_at: string }>(items: T[]) {
  return [...items].sort((first, second) => Date.parse(second.created_at) - Date.parse(first.created_at)).slice(0, 4);
}

function upcomingEvents<T extends { event_date: string }>(items: T[]) {
  const now = Date.now();
  return [...items]
    .sort((first, second) => Date.parse(first.event_date) - Date.parse(second.event_date))
    .filter((event) => Date.parse(event.event_date) >= now)
    .slice(0, 4);
}

const eventFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function Home() {
  const [companies, products, articles, events, categories] = await Promise.all([
    getCompanies(),
    getProducts(),
    getArticles(),
    getEvents(),
    getCategories(),
  ]);

  const latestCompanies = latestByCreatedAt(companies);
  const latestProducts = latestByCreatedAt(products);
  const latestArticles = latestByCreatedAt(articles).filter((article) => article.slug);
  const nextEvents = upcomingEvents(events);
  const mainCategories = categories.slice(0, 8);

  return (
    <div className="space-y-12">
      <section className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-teal">Industrial directory</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-normal text-ink sm:text-5xl">
            B2B Directory Platform
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink/70">
            Discover companies, products, articles, and events in one integrated industrial directory.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/companies" className="border border-teal bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink">
              Browse Companies
            </Link>
            <Link href="/products" className="border border-saffron px-5 py-3 text-sm font-semibold text-saffron transition hover:bg-saffron hover:text-white">
              View Products
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <DashboardStat label="Companies" value={companies.length} href="/companies" tone="bg-teal" />
          <DashboardStat label="Products" value={products.length} href="/products" tone="bg-saffron" />
          <DashboardStat label="Articles" value={articles.length} href="/articles" tone="bg-berry" />
          <DashboardStat label="Events" value={events.length} href="/events" tone="bg-ink" />
        </div>
      </section>

      <DashboardSection title="Latest Companies" href="/companies">
        {latestCompanies.length ? (
          latestCompanies.map((company) => (
            <Link key={company.id} href={`/companies/${company.slug}`} className="border border-line bg-white p-5 shadow-panel transition hover:border-teal">
              <p className="text-xs font-semibold uppercase tracking-normal text-teal">{company.category_name || "Company"}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{company.name}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/70">{company.description || "No description provided."}</p>
            </Link>
          ))
        ) : (
          <EmptyDashboardCard message="No companies yet." />
        )}
      </DashboardSection>

      <DashboardSection title="Latest Products" href="/products">
        {latestProducts.length ? (
          latestProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="border border-line bg-white p-5 shadow-panel transition hover:border-saffron">
              <p className="text-xs font-semibold uppercase tracking-normal text-saffron">{product.company_name || "Product"}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{product.name}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/70">{product.description || "No description provided."}</p>
            </Link>
          ))
        ) : (
          <EmptyDashboardCard message="No products yet." />
        )}
      </DashboardSection>

      <DashboardSection title="Latest Articles" href="/articles">
        {latestArticles.length ? (
          latestArticles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="border border-line bg-white p-5 shadow-panel transition hover:border-berry">
              <p className="text-xs font-semibold uppercase tracking-normal text-berry">{article.company_name || "Article"}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{article.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/70">{article.content}</p>
            </Link>
          ))
        ) : (
          <EmptyDashboardCard message="No articles yet." />
        )}
      </DashboardSection>

      <DashboardSection title="Upcoming Events" href="/events">
        {nextEvents.length ? (
          nextEvents.map((event) => (
            <Link key={event.id} href={event.slug ? `/events/${event.slug}` : "/events"} className="border border-line bg-white p-5 shadow-panel transition hover:border-teal">
              <p className="text-xs font-semibold uppercase tracking-normal text-teal">{event.company_name || "Event"}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{event.title}</h3>
              <p className="mt-3 text-sm font-medium text-ink">{eventFormatter.format(new Date(event.event_date))}</p>
              <p className="mt-1 text-sm text-ink/65">{event.location}</p>
            </Link>
          ))
        ) : (
          <EmptyDashboardCard message="No upcoming events yet." />
        )}
      </DashboardSection>

      <section className="border-t border-line pt-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-normal text-ink">Categories</h2>
          <Link href="/categories" className="text-sm font-semibold text-teal transition hover:text-ink">
            View all
          </Link>
        </div>
        {mainCategories.length ? (
          <div className="flex flex-wrap gap-2">
            {mainCategories.map((category) => (
              <Link key={category.id} href={`/companies?category=${category.slug}`} className="border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-teal hover:text-teal">
                {category.name}
              </Link>
            ))}
          </div>
        ) : (
          <EmptyDashboardCard message="No categories yet." />
        )}
      </section>
    </div>
  );
}

function DashboardStat({ href, label, tone, value }: { href: string; label: string; tone: string; value: number }) {
  return (
    <Link href={href} className="border border-line bg-white p-4 shadow-panel transition hover:-translate-y-0.5 hover:border-teal">
      <span className={`mb-4 block h-1.5 w-10 ${tone}`} />
      <span className="block text-2xl font-bold text-ink">{value}</span>
      <span className="mt-1 block text-sm text-ink/65">{label}</span>
    </Link>
  );
}

function DashboardSection({ children, href, title }: { children: React.ReactNode; href: string; title: string }) {
  return (
    <section className="border-t border-line pt-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-normal text-ink">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-teal transition hover:text-ink">
          View all
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{children}</div>
    </section>
  );
}

function EmptyDashboardCard({ message }: { message: string }) {
  return <div className="border border-dashed border-line bg-white p-5 text-sm text-ink/65 shadow-panel">{message}</div>;
}
