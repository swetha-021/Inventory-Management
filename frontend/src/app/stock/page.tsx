"use client";

import { FormEvent, useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { api } from "@/lib/api";
import type { PageResponse, Product, StockMovement } from "@/lib/types";

function StockInner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const page = await api<PageResponse<Product>>("/products?size=100&sort=name,asc");
    setProducts(page.content);
    const history = await api<PageResponse<StockMovement>>("/stock/movements?size=10");
    setMovements(history.content);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Failed to load stock data"));
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const path = type === "IN" ? "/stock/in" : "/stock/out";
      await api(path, {
        method: "POST",
        body: JSON.stringify({
          productId: Number(productId),
          quantity: Number(quantity),
          reason: reason || null,
        }),
      });
      setMessage(`Recorded stock ${type.toLowerCase()} of ${quantity}.`);
      setReason("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stock update failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Stock in / out</h1>
        <p className="text-sm text-slate-500">Quantity changes always create a movement record.</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <label>Product</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku}) — on hand {product.quantity}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as "IN" | "OUT")}>
            <option value="IN">Stock in</option>
            <option value="OUT">Stock out</option>
          </select>
        </div>
        <div>
          <label>Quantity</label>
          <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </div>
        <div>
          <label>Reason</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Receiving, sale, damage…" />
        </div>
        {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
        {message && <p className="sm:col-span-2 text-sm text-emerald-700">{message}</p>}
        <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white sm:col-span-2">
          Record movement
        </button>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b px-5 py-3 font-medium">Latest movements</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-2 font-medium">When</th>
              <th className="px-5 py-2 font-medium">Product</th>
              <th className="px-5 py-2 font-medium">Type</th>
              <th className="px-5 py-2 font-medium">Qty</th>
              <th className="px-5 py-2 font-medium">Reason</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id} className="border-t border-slate-100">
                <td className="px-5 py-2 text-slate-500">{new Date(movement.createdAt).toLocaleString()}</td>
                <td className="px-5 py-2">{movement.productName}</td>
                <td className="px-5 py-2">{movement.type}</td>
                <td className="px-5 py-2">{movement.quantity}</td>
                <td className="px-5 py-2">{movement.reason ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function StockPage() {
  return (
    <AuthGuard>
      <StockInner />
    </AuthGuard>
  );
}
