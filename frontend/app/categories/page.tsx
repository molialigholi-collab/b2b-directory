import Link from "next/link";
import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { getCategories } from "@/lib/api";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse category filters for companies and products in the B2B Directory Platform.",
  alternates: {
    canonical: absoluteUrl("/categories"),
  },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <PageIntro eyebrow="Categories" title="Category index" description="Browse company and product categories from the Django categories endpoint." />
      {categories.length === 0 ? (
        <EmptyState title="No categories yet" message="Add categories in Django admin and assign them to companies or products." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <article key={category.id} className="border border-line bg-white p-5 shadow-panel">
              <h2 className="text-xl font-semibold text-ink">{category.name}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/70">{category.description || "No description provided."}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={`/companies?category=${category.slug}`} className="border border-teal px-3 py-2 text-sm font-semibold text-teal transition hover:bg-teal hover:text-white">
                  View companies
                </Link>
                <Link href={`/products?category=${category.slug}`} className="border border-saffron px-3 py-2 text-sm font-semibold text-saffron transition hover:bg-saffron hover:text-white">
                  View products
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
