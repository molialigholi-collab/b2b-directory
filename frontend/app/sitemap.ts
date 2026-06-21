import type { MetadataRoute } from "next";
import { getArticles, getCategories, getCompanies, getEvents, getProducts } from "@/lib/api";
import { absoluteUrl } from "@/lib/seo";

const staticPages = ["/", "/companies", "/products", "/articles", "/events", "/categories"];

function page(url: string, lastModified?: string): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(url),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [companies, products, articles, events, categories] = await Promise.all([
    getCompanies(),
    getProducts(),
    getArticles(),
    getEvents(),
    getCategories(),
  ]);

  return [
    ...staticPages.map((url) => page(url)),
    ...companies.map((company) => page(`/companies/${company.slug}`, company.created_at)),
    ...products.map((product) => page(`/products/${product.id}`, product.created_at)),
    ...articles.filter((article) => article.slug).map((article) => page(`/articles/${article.slug}`, article.created_at)),
    ...events.filter((event) => event.slug).map((event) => page(`/events/${event.slug}`, event.created_at)),
    ...categories.map((category) => page(`/categories?category=${category.slug}`, category.created_at)),
  ];
}
