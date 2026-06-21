export type Company = {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  website: string;
  phone: string;
  email: string;
  created_at: string;
};

export type Product = {
  id: number;
  company: number;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
};

export type Article = {
  id: number;
  company: number;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
};

export type Event = {
  id: number;
  company: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  created_at: string;
};

type ApiList<T> = T[] | { results: T[] };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function fetchList<T>(path: string): Promise<T[]> {
  const payload = await fetchJson<ApiList<T>>(path);
  return Array.isArray(payload) ? payload : payload.results;
}

export function getCompanies() {
  return fetchList<Company>("/companies/");
}

export function getCompany(slug: string) {
  return fetchJson<Company>(`/companies/${slug}/`);
}

export function getProducts() {
  return fetchList<Product>("/products/");
}

export function getArticles() {
  return fetchList<Article>("/articles/");
}

export function getEvents() {
  return fetchList<Event>("/events/");
}
