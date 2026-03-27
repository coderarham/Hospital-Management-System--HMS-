"use client";
import { useState, useEffect } from "react";

interface Doctor {
  _id: string;
  name: string;
  departmentId?: { name: string };
}

export default function BookAppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({ doctorId: "", appointmentDate: "", symptoms: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/staff?role=Doctor")
      .then((r) => r.json())
      .then((d) => { if (d.success) setDoctors(d.data); });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) { setError(data.error); return; }
    setSuccess(`Appointment booked! Token #${data.data.tokenNumber}`);
    setForm({ doctorId: "", appointmentDate: "", symptoms: "" });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-sm text-gray-500 mt-1">Schedule a visit with a doctor</p>
      </div>

      <div className="max-w-lg">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
              <select className="input" value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required>
                <option value="">Choose a doctor...</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.name} {d.departmentId ? `— ${d.departmentId.name}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                className="input"
                value={form.appointmentDate}
                onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms / Reason</label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Describe your symptoms..."
                value={form.symptoms}
                onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
              />
            </div>

            {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{success}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
