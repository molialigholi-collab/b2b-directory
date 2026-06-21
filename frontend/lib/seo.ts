export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageTitle(title: string) {
  return `${title} | B2B Directory Platform`;
}

export function pageDescription(value?: string | null) {
  return value?.trim() || "Discover companies, products, articles, and events in one integrated industrial directory.";
}
