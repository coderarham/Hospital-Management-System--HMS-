"use client";
import { useState, useEffect } from "react";

interface Medicine {
  _id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  expiryDate: string;
  lowStockThreshold: number;
  price: number;
}

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", stock: 0, unit: "tablets", expiryDate: "", lowStockThreshold: 10, price: 0 });
  const [submitting, setSubmitting] = useState(false);

  async function fetchMedicines() {
    setLoading(true);
    const res = await fetch("/api/medicines");
    const data = await res.json();
    if (data.success) setMedicines(data.data);
    setLoading(false);
  }

  useEffect(() => { fetchMedicines(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    setShowForm(false);
    fetchMedicines();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicine Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage medicine stock</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Add Medicine</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add Medicine</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input className="input" placeholder="Medicine Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="input" placeholder="Category (e.g. Antibiotic)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              <div className="grid grid-cols-2 gap-2">
                <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} required />
                <input className="input" placeholder="Unit (tablets/ml)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="input" type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} required />
                <input className="input" type="number" placeholder="Low Stock Alert" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: +e.target.value })} />
              </div>
              <input className="input" type="date" placeholder="Expiry Date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} required />
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? "Adding..." : "Add"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Medicine</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Stock</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Price</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Expiry</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : medicines.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No medicines in inventory</td></tr>
              ) : (
                medicines.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{m.name}</td>
                    <td className="px-6 py-4 text-gray-500">{m.category}</td>
                    <td className="px-6 py-4">
                      <span className={m.stock <= m.lowStockThreshold ? "text-red-600 font-semibold" : "text-gray-700"}>
                        {m.stock} {m.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">₹{m.price}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(m.expiryDate).toLocaleDateString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${m.stock <= m.lowStockThreshold ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {m.stock <= m.lowStockThreshold ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
