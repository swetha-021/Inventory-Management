"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";

export default function AuthGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: Role[];
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getAuth();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (roles && !user.roles.some((role) => roles.includes(role))) {
      router.replace("/dashboard");
      return;
    }
    setReady(true);
  }, [router, roles]);

  if (!ready) {
    return <p className="p-8 text-sm text-slate-500">Loading…</p>;
  }

  return <>{children}</>;
}
