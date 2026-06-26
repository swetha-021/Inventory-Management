"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { api } from "@/lib/api";
import { isManagerPlus } from "@/lib/auth";
import type { Category, PageResponse, Product, Supplier } from "@/lib/types";

const emptyForm = {
  sku: "",
  name: "",
  description: "",
  categoryId: "",
  supplierId: "",
  reorderLevel: "10",
  unitPrice: "0",
};

function ProductsInner() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const canManage = isManagerPlus();

  const load = useCallback(async () => {
    const query = new URLSearchParams({
      page: String(page),
      size: "8",
      sort: "name,asc",
    });
    if (search.trim()) query.set("search", search.trim());
    const result = await api<PageResponse<Product>>(`/products?${query.toString()}`);
    setData(result);
  }, [page, search]);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Failed to load products"));
  }, [load]);

  useEffect(() => {
    api<Category[]>("/categories").then(setCategories).catch(() => undefined);
    if (canManage) {
      api<Supplier[]>("/suppliers").then(setSuppliers).catch(() => undefined);
    }
  }, [canManage]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      description: product.description ?? "",
      categoryId: product.categoryId ? String(product.categoryId) : "",
      supplierId: product.supplierId ? String(product.supplierId) : "",
      reorderLevel: String(product.reorderLevel),
      unitPrice: String(product.unitPrice),
    });
    setShowForm(true);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const payload = {
      sku: form.sku,
      name: form.name,
      description: form.description || null,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      supplierId: form.supplierId ? Number(form.supplierId) : null,
      reorderLevel: Number(form.reorderLevel),
      unitPrice: Number(form.unitPrice),
    };
    try {
      if (editingId) {
        await api(`/products/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await api("/products", { method: "POST", body: JSON.stringify(payload) });
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api(`/products/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-slate-500">Search, filter, and manage catalog items.</p>
        </div>
        {canManage && (
          <button onClick={openCreate} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Add product
          </button>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setPage(0);
          load().catch((err) => setError(err instanceof Error ? err.message : "Search failed"));
        }}
        className="flex gap-2"
      >
        <input
          placeholder="Search by name or SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="rounded-md border border-slate-300 px-4 py-2 text-sm">
          Search
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {showForm && canManage && (
        <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
          <h2 className="sm:col-span-2 font-medium">{editingId ? "Edit product" : "New product"}</h2>
          <div>
            <label>SKU</label>
            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
          </div>
          <div>
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="sm:col-span-2">
            <label>Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label>Category</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">None</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Supplier</label>
            <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })}>
              <option value="">None</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Reorder level</label>
            <input type="number" min={0} value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} />
          </div>
          <div>
            <label>Unit price</label>
            <input type="number" min={0} step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">SKU</th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Qty</th>
              <th className="px-4 py-2 font-medium">Reorder</th>
              {canManage && <th className="px-4 py-2 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data?.content.map((product) => (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-mono text-xs">{product.sku}</td>
                <td className="px-4 py-2">
                  {product.name}
                  {product.lowStock && (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">Low</span>
                  )}
                </td>
                <td className="px-4 py-2">{product.categoryName ?? "—"}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2">{product.reorderLevel}</td>
                {canManage && (
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => openEdit(product)} className="text-slate-700 underline">Edit</button>
                    <button onClick={() => onDelete(product.id)} className="text-rose-700 underline">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center gap-3 text-sm">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded border px-3 py-1 disabled:opacity-40">
            Previous
          </button>
          <span>Page {data.page + 1} of {data.totalPages}</span>
          <button disabled={page + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded border px-3 py-1 disabled:opacity-40">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <AuthGuard>
      <ProductsInner />
    </AuthGuard>
  );
}
