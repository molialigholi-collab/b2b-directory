import Link from "next/link";

const navItems = [
  { href: "/categories", label: "Categories" },
  { href: "/companies", label: "Companies" },
  { href: "/products", label: "Products" },
  { href: "/rfqs", label: "RFQs" },
  { href: "/articles", label: "Articles" },
  { href: "/events", label: "Events" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/account", label: "Account" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper/95">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-normal text-ink">
          B2B Directory
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm font-medium text-ink/75">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-line px-3 py-2 transition hover:border-teal hover:text-teal"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
