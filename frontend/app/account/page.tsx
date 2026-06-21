"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthUser, getCurrentUser, logout } from "@/lib/auth";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    router.push("/login");
  }

  if (isLoading) {
    return <div className="border border-line bg-white p-6 text-sm text-ink/65 shadow-panel">Loading account...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl border border-line bg-white p-6 shadow-panel">
        <h1 className="text-3xl font-bold tracking-normal text-ink">Account</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">Login to view your account details.</p>
        <Link href="/login" className="mt-5 inline-flex border border-teal bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="border border-line bg-white p-6 shadow-panel">
        <h1 className="text-3xl font-bold tracking-normal text-ink">Account</h1>
        <dl className="mt-6 grid gap-4 text-sm">
          <div>
            <dt className="font-semibold text-ink">Username</dt>
            <dd className="mt-1 text-ink/70">{user.username}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Email</dt>
            <dd className="mt-1 text-ink/70">{user.email}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Staff</dt>
            <dd className="mt-1 text-ink/70">{user.is_staff ? "Yes" : "No"}</dd>
          </div>
        </dl>
        <button onClick={handleLogout} className="mt-6 border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:border-teal hover:text-teal">
          Logout
        </button>
      </section>
      <p className="text-xs leading-5 text-ink/50">
        Auth foundation note: JWTs are stored in browser localStorage for now. Production should move auth tokens to secure httpOnly cookies.
      </p>
    </div>
  );
}
