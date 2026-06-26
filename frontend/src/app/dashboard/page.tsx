"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { api } from "@/lib/api";
import type { Dashboard } from "@/lib/types";

function DashboardInner() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Dashboard>("/dashboard")
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard"));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-slate-500">Loading dashboard…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-500">Live inventory snapshot for your role.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total products</p>
          <p className="mt-2 text-3xl font-semibold">{data.totalProducts}</p>
        </div>
        {data.lowStockCount !== null && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm text-amber-800">Low-stock alerts</p>
            <p className="mt-2 text-3xl font-semibold text-amber-900">{data.lowStockCount}</p>
            <p className="mt-1 text-xs text-amber-700">Products at or below reorder level</p>
          </div>
        )}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-3">
          <h2 className="font-medium">Recent stock activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-2 font-medium">When</th>
                <th className="px-5 py-2 font-medium">Product</th>
                <th className="px-5 py-2 font-medium">Type</th>
                <th className="px-5 py-2 font-medium">Qty</th>
                <th className="px-5 py-2 font-medium">By</th>
              </tr>
            </thead>
            <tbody>
              {data.recentMovements.length === 0 && (
                <tr>
                  <td className="px-5 py-4 text-slate-500" colSpan={5}>No movements yet.</td>
                </tr>
              )}
              {data.recentMovements.map((movement) => (
                <tr key={movement.id} className="border-t border-slate-100">
                  <td className="px-5 py-2 text-slate-500">{new Date(movement.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-2">{movement.productName}</td>
                  <td className="px-5 py-2">
                    <span className={movement.type === "IN" ? "text-emerald-700" : "text-rose-700"}>
                      {movement.type}
                    </span>
                  </td>
                  <td className="px-5 py-2">{movement.quantity}</td>
                  <td className="px-5 py-2">{movement.performedByEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardInner />
    </AuthGuard>
  );
}
