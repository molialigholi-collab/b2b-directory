"use client";

import { Company, Product } from "@/lib/api";
import { getAccessToken, logout } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

export type MyCompanyResponse = {
  company: Company | null;
  detail?: string;
};

export type MyProductsResponse = {
  company: Company | null;
  products: Product[];
  detail?: string;
};

async function dashboardRequest<T>(path: string, options: RequestInit = {}) {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Login is required.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (response.status === 401) {
    logout();
    throw new Error("Your session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(payload?.detail || "Dashboard request failed.");
  }

  return payload as T;
}

export function getMyCompany() {
  return dashboardRequest<MyCompanyResponse>("/dashboard/my-company/");
}

export function updateMyCompany(payload: Pick<Company, "description" | "email" | "name" | "phone" | "website">) {
  return dashboardRequest<MyCompanyResponse>("/dashboard/my-company/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getMyProducts() {
  return dashboardRequest<MyProductsResponse>("/dashboard/my-products/");
}

export function createMyProduct(payload: Pick<Product, "description" | "name"> & { category?: number | null }) {
  return dashboardRequest<Product>("/dashboard/my-products/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateMyProduct(id: number, payload: Pick<Product, "description" | "name"> & { category?: number | null }) {
  return dashboardRequest<Product>(`/dashboard/my-products/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteMyProduct(id: number) {
  return dashboardRequest<unknown>(`/dashboard/my-products/${id}/`, {
    method: "DELETE",
  });
}
