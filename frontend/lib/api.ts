export type Company = {
  id: number;
  category: number | null;
  category_name: string | null;
  category_slug: string | null;
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
  company_name: string;
  company_slug: string;
  category: number | null;
  category_name: string | null;
  category_slug: string | null;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
};

export type Article = {
  id: number;
  company: number;
  company_name: string;
  company_slug: string;
  title: string;
  slug: string | null;
  content: string;
  image: string | null;
  created_at: string;
};

export type Event = {
  id: number;
  company: number;
  company_name: string;
  company_slug: string;
  title: string;
  slug: string | null;
  description: string;
  event_date: string;
  location: string;
  created_at: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
};

export type InquiryPayload = {
  company?: number;
  product?: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  source_page: string;
};

type ApiList<T> = T[] | { results: T[] };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

type ListFilters = {
  search?: string;
  category?: string;
};

function withFilters(path: string, filters: ListFilters = {}) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (!params.size) {
    return path;
  }

  return `${path}?${params.toString()}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function createInquiry(payload: InquiryPayload) {
  const response = await fetch(`${API_BASE_URL}/inquiries/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Unable to send inquiry. Please check the form and try again.");
  }

  return response.json();
}

async function fetchList<T>(path: string): Promise<T[]> {
  const payload = await fetchJson<ApiList<T>>(path);
  return Array.isArray(payload) ? payload : payload.results;
}

export function getCategories() {
  return fetchList<Category>("/categories/");
}

export function getCategory(slug: string) {
  return fetchJson<Category>(`/categories/${slug}/`);
}

export function getCompanies(filters: ListFilters = {}) {
  return fetchList<Company>(withFilters("/companies/", filters));
}

export function getCompany(slug: string) {
  return fetchJson<Company>(`/companies/${slug}/`);
}

export function getProducts(filters: ListFilters = {}) {
  return fetchList<Product>(withFilters("/products/", filters));
}

export function getProduct(id: string) {
  return fetchJson<Product>(`/products/${id}/`);
}

export function getArticles() {
  return fetchList<Article>("/articles/");
}

export function getArticle(slug: string) {
  return fetchJson<Article>(`/articles/${slug}/`);
}

export function getEvents() {
  return fetchList<Event>("/events/");
}

export function getEvent(slug: string) {
  return fetchJson<Event>(`/events/${slug}/`);
}
