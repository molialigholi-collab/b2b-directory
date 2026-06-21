import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/inquiry-form";
import { getProduct, getProducts } from "@/lib/api";
import { absoluteUrl, pageDescription } from "@/lib/seo";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const description = pageDescription(product.description);

  return {
    title: product.name,
    description,
    alternates: {
      canonical: absoluteUrl(`/products/${product.id}`),
    },
    openGraph: {
      title: product.name,
      description,
      url: absoluteUrl(`/products/${product.id}`),
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Link href="/products" className="inline-flex text-sm font-semibold text-saffron transition hover:text-ink">
        Back to products
      </Link>

      <section className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[220px_1fr]">
        <div className="flex h-52 w-full items-center justify-center border border-line bg-white text-sm font-semibold text-ink/55 shadow-panel lg:w-52">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-4" />
          ) : (
            <span>No image</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-saffron">Product profile</p>
          <h1 className="mt-3 text-3xl font-bold tracking-normal text-ink sm:text-4xl">{product.name}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-ink/70">{product.description || "No description provided."}</p>
        </div>
      </section>

      <section className="border border-line bg-white p-5 shadow-panel">
        <h2 className="text-sm font-semibold uppercase tracking-normal text-ink/60">Company</h2>
        {product.company_slug ? (
          <Link href={`/companies/${product.company_slug}`} className="mt-3 inline-flex text-lg font-semibold text-teal transition hover:text-ink">
            {product.company_name || `Company #${product.company}`}
          </Link>
        ) : (
          <p className="mt-3 text-sm text-ink/65">{product.company_name || `Company #${product.company}`}</p>
        )}
      </section>

      <InquiryForm companyId={product.company} productId={product.id} sourcePage={`/products/${product.id}`} title={`Inquire about ${product.name}`} />
    </div>
  );
}
