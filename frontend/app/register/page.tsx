"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      await register(username, email, password);
      router.push("/account");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <section className="border border-line bg-white p-6 shadow-panel">
        <h1 className="text-3xl font-bold tracking-normal text-ink">Register</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">Create an account for future company ownership workflows.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Username
            <input name="username" required className="min-h-11 border border-line bg-paper px-3 font-normal outline-none focus:border-teal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Email
            <input name="email" type="email" required className="min-h-11 border border-line bg-paper px-3 font-normal outline-none focus:border-teal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Password
            <input name="password" type="password" minLength={8} required className="min-h-11 border border-line bg-paper px-3 font-normal outline-none focus:border-teal" />
          </label>
          <button type="submit" disabled={isSubmitting} className="min-h-11 border border-teal bg-teal px-5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60">
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
          {error ? <p className="text-sm font-medium text-berry">{error}</p> : null}
        </form>
        <p className="mt-5 text-sm text-ink/65">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-teal transition hover:text-ink">
            Login
          </Link>
        </p>
      </section>
    </div>
  );
}
