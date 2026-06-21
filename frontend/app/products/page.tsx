import Link from "next/link";
import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { SearchForm } from "@/components/search-form";
import { getCategories, getProducts } from "@/lib/api";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore product listings connected to verified company profiles and category filters.",
  alternates: {
    canonical: absoluteUrl("/products"),
  },
};

type ProductsPageProps = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category = "", search = "" } = await searchParams;
  const query = search.trim();
  const categoryFilter = category.trim();
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category: categoryFilter, search: query }),
  ]);

  return (
    <div>
      <PageIntro eyebrow="Products" title="Product catalog" description="Review products connected to company records through the Django products endpoint." />
      <SearchForm action="/products" defaultValue={query} hiddenFields={{ category: categoryFilter }} placeholder="Search products by name, description, or company" />
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/products" className={`border px-3 py-2 text-sm font-semibold transition ${categoryFilter ? "border-line text-ink/70 hover:border-saffron hover:text-saffron" : "border-saffron bg-saffron text-white"}`}>
          All categories
        </Link>
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`/products?category=${item.slug}`}
            className={`border px-3 py-2 text-sm font-semibold transition ${categoryFilter === item.slug ? "border-saffron bg-saffron text-white" : "border-line text-ink/70 hover:border-saffron hover:text-saffron"}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      {products.length === 0 ? (
        <EmptyState
          title={query || categoryFilter ? "No products found" : "No products yet"}
          message={query || categoryFilter ? "Try a different product search or category filter." : "Create products in Django admin and refresh this page."}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="border border-line bg-white p-5 shadow-panel transition hover:border-saffron">
              <p className="text-xs font-semibold uppercase tracking-normal text-saffron">
                {product.company_name || `Company #${product.company}`}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-ink">
                <Link href={`/products/${product.id}`} className="transition hover:text-saffron">
                  {product.name}
                </Link>
              </h2>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-ink/70">{product.description || "No description provided."}</p>
              {product.category_slug ? (
                <Link href={`/products?category=${product.category_slug}`} className="mt-4 inline-flex text-xs font-semibold uppercase tracking-normal text-saffron transition hover:text-ink">
                  {product.category_name}
                </Link>
              ) : null}
              <Link href={`/products/${product.id}`} className="mt-5 inline-flex text-sm font-semibold text-saffron transition hover:text-ink">
                View product details
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
