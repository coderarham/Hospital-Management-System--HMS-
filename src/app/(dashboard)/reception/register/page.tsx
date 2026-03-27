"use client";
import { useState } from "react";

export default function RegisterPatientPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "Patient" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) { setError(data.error); return; }
    setSuccess(`Patient "${form.name}" registered successfully!`);
    setForm({ name: "", email: "", password: "", phone: "", role: "Patient" });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Register New Patient</h1>
        <p className="text-sm text-gray-500 mt-1">Add walk-in patient to the system</p>
      </div>

      <div className="max-w-lg">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input className="input" placeholder="Patient full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input className="input" type="email" placeholder="patient@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input className="input" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
              <input className="input" type="password" placeholder="Set initial password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>

            {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{success}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? "Registering..." : "Register Patient"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
