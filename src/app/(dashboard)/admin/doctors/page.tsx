"use client";
import { useState, useEffect, useCallback } from "react";
import IndiaAddressFields from "@/components/ui/IndiaAddressFields";

const SPECIALIZATIONS = [
  "General Physician/Medicine", "Cardiology", "Neurology", "Endocrinology/Diabetology",
  "Gastroenterology", "Pulmonology", "Oncology", "Hematology", "Nephrology", "Rheumatology",
  "Dermatology", "Psychiatry", "General Surgery", "Orthopedics", "Neurosurgery", "Urology",
  "Cardiothoracic Surgery", "Plastic and Cosmetic Surgery", "Ophthalmology",
  "Ear, Nose, and Throat (ENT) / Otolaryngology", "Obstetrics & Gynecology (OB-GYN)",
  "Pediatrics", "Neonatology & NICU", "Paediatric Surgery", "Accident and Emergency (A&E) Care",
  "Critical Care/ICU", "Anesthesiology", "Radiology", "Pathology/Laboratory Medicine",
  "Physiotherapy/Rehabilitation", "Nuclear Medicine", "Transfusion Medicine",
];

interface Doctor {
  _id: string;
  doctorId?: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  gender?: string;
  experience?: number;
  address?: string;
  state?: string;
  city?: string;
  specialization?: string;
}

const emptyForm = {
  name: "", email: "", password: "", phone: "", role: "Doctor",
  gender: "", experience: "", address: "", state: "", city: "", specialization: "",
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showPwd, setShowPwd] = useState(false);
  const [pwdChanged, setPwdChanged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/staff?role=Doctor");
    const data = await res.json();
    if (data.success) setDoctors(data.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function openAdd() {
    setEditDoctor(null);
    setForm(emptyForm);
    setShowPwd(false);
    setPwdChanged(false);
    setError("");
    setShowForm(true);
  }

  function openEdit(d: Doctor) {
    setEditDoctor(d);
    setForm({
      name: d.name,
      email: d.email,
      password: "",
      phone: d.phone || "",
      role: "Doctor",
      gender: d.gender || "",
      experience: String(d.experience || ""),
      address: d.address || "",
      state: d.state || "",
      city: d.city || "",
      specialization: d.specialization || "",
    });
    setShowPwd(false);
    setPwdChanged(false);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload: Record<string, unknown> = { ...form };
    if (form.experience) payload.experience = Number(form.experience);
    else delete payload.experience;
    if (!form.specialization) delete payload.specialization;
    if (!form.gender) delete payload.gender;
    if (editDoctor && form.password === "") delete payload.password;

    const url = editDoctor ? `/api/admin/staff/${editDoctor._id}` : "/api/admin/staff";
    const method = editDoctor ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(data.error); return; }
    setShowForm(false);
    fetchAll();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchAll();
  }

  const f = (field: string, val: string) => setForm((p) => ({ ...p, [field]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all hospital doctors</p>
        </div>
        <button onClick={openAdd} className="btn-primary">+ Add Doctor</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editDoctor ? "Edit Doctor" : "Add New Doctor"}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{editDoctor ? `Editing Dr. ${editDoctor.name}` : "Fill in the details below"}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Basic Information</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input className="input" placeholder="Dr. Full Name" value={form.name} onChange={(e) => f("name", e.target.value)} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input className="input" type="email" placeholder="doctor@hospital.com" value={form.email} onChange={(e) => f("email", e.target.value)} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {!editDoctor && <span className="text-red-500">*</span>}
                    {editDoctor && <span className="text-xs text-gray-400 font-normal ml-1">(blank chhodo = nahi badlega)</span>}
                  </label>
                  <div className="relative">
                    <input
                      className="input pr-16"
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => { f("password", e.target.value); setPwdChanged(true); }}
                      required={!editDoctor}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-sky-600 font-medium hover:text-sky-800"
                    >
                      {showPwd ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input className="input" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={(e) => f("phone", e.target.value)} />
                </div>

                <div className="md:col-span-2 mt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Professional Details</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <select className="input" value={form.specialization} onChange={(e) => f("specialization", e.target.value)}>
                    <option value="">Select Specialization</option>
                    {SPECIALIZATIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                  <input className="input" type="number" min="0" max="60" placeholder="e.g. 10" value={form.experience} onChange={(e) => f("experience", e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select className="input" value={form.gender} onChange={(e) => f("gender", e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <IndiaAddressFields
                    address={form.address}
                    state={form.state}
                    city={form.city}
                    onAddressChange={(v) => f("address", v)}
                    onStateChange={(v) => f("state", v)}
                    onCityChange={(v) => f("city", v)}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="submit" disabled={submitting} className="btn-primary flex-1 py-2.5">
                  {submitting ? "Saving..." : editDoctor ? "Save Changes" : "Add Doctor"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <h3 className="font-bold text-gray-900 mb-1">Delete Doctor?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">Delete</button>
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">#</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Specialization</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Experience</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Gender</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Phone</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : doctors.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No doctors found. Add one!</td></tr>
              ) : (
                doctors.map((d, index) => (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800 text-base">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">Dr. {d.name}</p>
                      <p className="text-xs text-gray-400">{d.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{d.specialization || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{d.experience ? `${d.experience} yrs` : "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{d.gender || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{d.phone || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${d.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {d.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(d)} className="text-xs bg-sky-50 text-sky-600 hover:bg-sky-100 px-3 py-1.5 rounded-lg font-medium transition-colors">Edit</button>
                        <button onClick={() => setDeleteId(d._id)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors">Delete</button>
                      </div>
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
