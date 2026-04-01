"use client";
import { useState, useEffect, useCallback } from "react";
import IndiaAddressFields from "@/components/ui/IndiaAddressFields";

interface Doctor { _id: string; name: string; specialization?: string; }
interface Appointment { _id: string; doctorId: { name: string; specialization?: string }; appointmentDate: string; status: string; symptoms?: string; tokenNumber?: number; }
interface Patient {
  _id: string; patientId?: string; name: string; email?: string; phone?: string;
  gender?: string; dateOfBirth?: string; address?: string; state?: string; city?: string; pincode?: string;
  appointment?: Appointment | null;
}

const emptyForm = {
  name: "", email: "", password: "", phone: "", gender: "", dateOfBirth: "",
  address: "", state: "", city: "", pincode: "",
  doctorId: "", appointmentDate: "", symptoms: "",
};

export default function RegisterPatientPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewPatient, setViewPatient] = useState<Patient | null>(null);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [pRes, dRes] = await Promise.all([fetch("/api/reception/patients"), fetch("/api/doctors")]);
    const pData = await pRes.json();
    const dData = await dRes.json();
    if (pData.success) setPatients(pData.data);
    if (Array.isArray(dData)) setDoctors(dData);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function openAdd() {
    setEditPatient(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(p: Patient) {
    setEditPatient(p);
    const appt = p.appointment;
    setForm({
      name: p.name, email: p.email || "", password: "", phone: p.phone || "",
      gender: p.gender || "", dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : "",
      address: p.address || "", state: p.state || "", city: p.city || "", pincode: p.pincode || "",
      doctorId: appt ? String((appt.doctorId as unknown as { _id: string })?._id || "") : "",
      appointmentDate: appt ? appt.appointmentDate.slice(0, 16) : "",
      symptoms: appt?.symptoms || "",
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const payload: Record<string, unknown> = { ...form };
    if (!payload.password) delete payload.password;
    if (editPatient?.appointment) payload.appointmentId = editPatient.appointment._id;

    const url = editPatient ? `/api/reception/patients/${editPatient._id}` : "/api/reception/patients";
    const method = editPatient ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(data.error); return; }
    setShowForm(false);
    fetchAll();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/reception/patients/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchAll();
  }

  const f = (field: string, val: string) => setForm((p) => ({ ...p, [field]: val }));

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.patientId || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.phone || "").includes(search)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Registration</h1>
          <p className="text-sm text-gray-500 mt-1">Register walk-in patients and manage appointments</p>
        </div>
        <button onClick={openAdd} className="btn-primary">+ Register Patient</button>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <input className="input" placeholder="Search by name, patient ID or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Register / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-6">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editPatient ? "Edit Patient" : "Register New Patient"}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{editPatient ? `Editing ${editPatient.name}` : "Fill in patient details"}</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Patient Info</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input className="input" placeholder="Patient full name" value={form.name} onChange={(e) => f("name", e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input className="input" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={(e) => f("phone", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 text-xs font-normal">(optional)</span></label>
                  <input className="input" type="email" placeholder="patient@email.com" value={form.email} onChange={(e) => f("email", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {!editPatient && <span className="text-red-500">*</span>}
                    {editPatient && <span className="text-xs text-gray-400 font-normal ml-1">(blank = nahi badlega)</span>}
                  </label>
                  <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={(e) => f("password", e.target.value)} required={!editPatient} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select className="input" value={form.gender} onChange={(e) => f("gender", e.target.value)}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input className="input" type="date" value={form.dateOfBirth} onChange={(e) => f("dateOfBirth", e.target.value)} />
                </div>
              </div>

              <IndiaAddressFields
                address={form.address} state={form.state} city={form.city}
                onAddressChange={(v) => f("address", v)}
                onStateChange={(v) => f("state", v)}
                onCityChange={(v) => f("city", v)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <input className="input" placeholder="e.g. 400001" value={form.pincode} onChange={(e) => f("pincode", e.target.value)} />
              </div>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-2">Appointment Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <select className="input" value={form.doctorId} onChange={(e) => f("doctorId", e.target.value)}>
                    <option value="">Select Doctor</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>Dr. {d.name}{d.specialization ? ` — ${d.specialization}` : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date & Time</label>
                  <input className="input" type="datetime-local" value={form.appointmentDate} onChange={(e) => f("appointmentDate", e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms / Reason</label>
                  <textarea className="input resize-none" rows={2} placeholder="Patient symptoms or reason for visit" value={form.symptoms} onChange={(e) => f("symptoms", e.target.value)} />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn-primary flex-1 py-2.5">
                  {submitting ? "Saving..." : editPatient ? "Save Changes" : "Register Patient"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{viewPatient.name}</h2>
                <span className="text-xs font-mono text-sky-600 font-semibold">{viewPatient.patientId || "—"}</span>
              </div>
              <button onClick={() => setViewPatient(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Phone", viewPatient.phone],
                  ["Email", viewPatient.email],
                  ["Gender", viewPatient.gender],
                  ["Date of Birth", viewPatient.dateOfBirth ? new Date(viewPatient.dateOfBirth).toLocaleDateString("en-IN") : null],
                  ["Address", viewPatient.address],
                  ["State", viewPatient.state],
                  ["City", viewPatient.city],
                  ["Pin Code", viewPatient.pincode],
                ].map(([label, val]) => val ? (
                  <div key={label}>
                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                    <p className="text-gray-800 font-medium">{val}</p>
                  </div>
                ) : null)}
              </div>

              {viewPatient.appointment && (
                <div className="mt-4 p-4 bg-sky-50 rounded-xl border border-sky-100">
                  <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-2">Appointment</p>
                  <p className="text-sm font-semibold text-gray-800">Dr. {viewPatient.appointment.doctorId?.name}</p>
                  {viewPatient.appointment.doctorId?.specialization && (
                    <p className="text-xs text-gray-500">{viewPatient.appointment.doctorId.specialization}</p>
                  )}
                  <p className="text-sm text-gray-700 mt-1">
                    📅 {new Date(viewPatient.appointment.appointmentDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  {viewPatient.appointment.tokenNumber && (
                    <p className="text-sm text-gray-700">🎫 Token #{viewPatient.appointment.tokenNumber}</p>
                  )}
                  {viewPatient.appointment.symptoms && (
                    <p className="text-sm text-gray-600 mt-1">🩺 {viewPatient.appointment.symptoms}</p>
                  )}
                  <span className={`mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${viewPatient.appointment.status === "Scheduled" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {viewPatient.appointment.status}
                  </span>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => { setViewPatient(null); openEdit(viewPatient); }} className="btn-primary flex-1 py-2">Edit</button>
              <button onClick={() => setViewPatient(null)} className="btn-secondary flex-1 py-2">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <h3 className="font-bold text-gray-900 mb-1">Delete Patient?</h3>
            <p className="text-sm text-gray-500 mb-5">Patient aur uski saari appointments delete ho jayengi.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium">Delete</button>
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Patient ID</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Phone</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Doctor</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Appointment</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No patients found.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-semibold text-sky-600">{p.patientId || "—"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.email || "—"}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{p.phone || "—"}</td>
                  <td className="px-5 py-4 text-gray-600">
                    {p.appointment ? `Dr. ${p.appointment.doctorId?.name}` : "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {p.appointment
                      ? new Date(p.appointment.appointmentDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    {p.appointment ? (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.appointment.status === "Scheduled" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {p.appointment.status}
                      </span>
                    ) : <span className="text-xs text-gray-400">No Appt.</span>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setViewPatient(p)} className="text-xs bg-sky-50 text-sky-600 hover:bg-sky-100 px-3 py-1.5 rounded-lg font-medium">View</button>
                      <button onClick={() => openEdit(p)} className="text-xs bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-lg font-medium">Edit</button>
                      <button onClick={() => setDeleteId(p._id)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
