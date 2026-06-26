"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAuth, getAuth, isAdmin } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/stock", label: "Stock" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuth());
  }, [pathname]);

  if (!user || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const onLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-slate-900">
            Inventory
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  pathname === link.href
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin() && (
              <Link
                href="/admin/users"
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  pathname.startsWith("/admin")
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Users
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">{user.roles.join(" · ")}</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
