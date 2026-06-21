"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthUser, getCurrentUser } from "@/lib/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="border border-line bg-white p-6 text-sm text-ink/65 shadow-panel">Loading dashboard...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl border border-line bg-white p-6 shadow-panel">
        <h1 className="text-3xl font-bold tracking-normal text-ink">Owner Dashboard</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">Login is required to manage your company dashboard.</p>
        <Link href="/login" className="mt-5 inline-flex border border-teal bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="border-b border-line pb-8">
        <p className="text-sm font-semibold uppercase tracking-normal text-teal">Owner workspace</p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal text-ink sm:text-4xl">Dashboard</h1>
        <p className="mt-4 text-sm leading-6 text-ink/65">Signed in as {user.username}. Manage your company profile and product listings.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/company" className="border border-line bg-white p-6 shadow-panel transition hover:border-teal">
          <h2 className="text-xl font-semibold text-ink">Company Profile</h2>
          <p className="mt-3 text-sm leading-6 text-ink/65">Update public business information for your owned company.</p>
        </Link>
        <Link href="/dashboard/products" className="border border-line bg-white p-6 shadow-panel transition hover:border-saffron">
          <h2 className="text-xl font-semibold text-ink">Products</h2>
          <p className="mt-3 text-sm leading-6 text-ink/65">List, add, edit, and remove basic product records.</p>
        </Link>
        <Link href="/dashboard/rfq-responses" className="border border-line bg-white p-6 shadow-panel transition hover:border-teal">
          <h2 className="text-xl font-semibold text-ink">RFQ Responses</h2>
          <p className="mt-3 text-sm leading-6 text-ink/65">Track responses submitted by your company.</p>
        </Link>
      </div>
    </div>
  );
}
