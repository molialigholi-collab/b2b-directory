import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { getProducts } from "@/lib/api";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <PageIntro eyebrow="Products" title="Product catalog" description="Review products connected to company records through the Django products endpoint." />
      {products.length === 0 ? (
        <EmptyState title="No products yet" message="Create products in Django admin and refresh this page." />
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
