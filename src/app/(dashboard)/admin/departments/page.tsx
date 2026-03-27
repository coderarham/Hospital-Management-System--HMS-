"use client";
import { useState, useEffect } from "react";

interface Department {
  _id: string;
  name: string;
  description?: string;
  headOfDepartment?: { name: string };
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  async function fetchDepts() {
    setLoading(true);
    const res = await fetch("/api/admin/departments");
    const data = await res.json();
    if (data.success) setDepartments(data.data);
    setLoading(false);
  }

  useEffect(() => { fetchDepts(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/admin/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    setShowForm(false);
    setForm({ name: "", description: "" });
    fetchDepts();
  }

  const deptIcons: Record<string, string> = {
    Cardiology: "🫀", Neurology: "🧠", Orthopedics: "🦴", Pediatrics: "👶",
    Radiology: "🩻", Pathology: "🔬", Emergency: "🚑", Surgery: "🔪",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage hospital departments</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Add Department</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Department</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input className="input" placeholder="Department Name (e.g. Cardiology)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <textarea className="input resize-none" rows={3} placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? "Adding..." : "Add"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((d) => (
            <div key={d._id} className="card hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{deptIcons[d.name] || "🏥"}</div>
              <h3 className="font-semibold text-gray-800">{d.name}</h3>
              {d.description && <p className="text-sm text-gray-500 mt-1">{d.description}</p>}
              {d.headOfDepartment && (
                <p className="text-xs text-sky-600 mt-2">Head: {d.headOfDepartment.name}</p>
              )}
            </div>
          ))}
          {departments.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">No departments yet. Add one!</div>
          )}
        </div>
      )}
    </div>
  );
}
