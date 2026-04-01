"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface PatientInfo { _id: string; name: string; phone?: string; patientId?: string; gender?: string; dateOfBirth?: string; address?: string; }
interface Appt { _id: string; patientId: PatientInfo; appointmentDate: string; status: string; symptoms?: string; tokenNumber?: number; }
interface Medicine { medicineName: string; dosage: string; frequency: string; duration: string; }
interface DoctorInfo { name: string; specialization?: string; }

const emptyMed: Medicine = { medicineName: "", dosage: "", frequency: "", duration: "" };

export default function DoctorDashboard() {
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo>({ name: "" });
  const [todayList, setTodayList] = useState<Appt[]>([]);
  const [laterList, setLaterList] = useState<Appt[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [laterCount, setLaterCount] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(true);

  // Prescription modal
  const [rxAppt, setRxAppt] = useState<Appt | null>(null);
  const [rxForm, setRxForm] = useState({ diagnosis: "", notes: "", medicines: [{ ...emptyMed }] });
  const [saving, setSaving] = useState(false);
  const [savedRx, setSavedRx] = useState<Record<string, unknown> | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/appointments");
    const data = await res.json();
    if (!data.success) { setLoading(false); return; }

    const all: Appt[] = data.data;
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);

    const today = all.filter((a) => { const d = new Date(a.appointmentDate); return d >= now && d < tomorrow && a.status === "Scheduled"; });
    const later = all.filter((a) => new Date(a.appointmentDate) >= tomorrow && a.status === "Scheduled");
    const uniquePats = new Set(all.map((a) => a.patientId?._id)).size;

    setTodayList(today);
    setLaterList(later.slice(0, 5));
    setTodayCount(today.length);
    setLaterCount(later.length);
    setTotalPatients(uniquePats);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    // get doctor name from cookie via API
    fetch("/api/appointments").then(r => r.json()).then(() => {});
  }, [fetchData]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  }

  async function handleDone(appt: Appt) {
    await updateStatus(appt._id, "Completed");
    // Send billing notification
    await fetch("/api/notifications", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toRole: "Billing",
        message: `Patient ${appt.patientId.name} (${appt.patientId.patientId || ""}) ki appointment complete hui. Bill generate karein.`,
        patientId: appt.patientId._id,
        appointmentId: appt._id,
      }),
    });
  }

  async function savePrescription(e: React.FormEvent) {
    e.preventDefault();
    if (!rxAppt) return;
    setSaving(true);
    const res = await fetch("/api/prescriptions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: rxAppt._id, patientId: rxAppt.patientId._id, ...rxForm }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) setSavedRx(data.data);
  }

  function openRx(appt: Appt) {
    setRxAppt(appt);
    setRxForm({ diagnosis: "", notes: "", medicines: [{ ...emptyMed }] });
    setSavedRx(null);
  }

  function updateMed(i: number, field: keyof Medicine, val: string) {
    setRxForm((p) => { const m = [...p.medicines]; m[i] = { ...m[i], [field]: val }; return { ...p, medicines: m }; });
  }

  const statCards = [
    { title: "Today's Appointments", value: todayCount, icon: "📅", color: "bg-sky-50 text-sky-600" },
    { title: "Total Patients", value: totalPatients, icon: "🧑‍⚕️", color: "bg-green-50 text-green-600" },
    { title: "Later Schedule", value: laterCount, icon: "⏳", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Doctor 👋</h1>
        <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.title} className={`card flex items-center gap-4 ${s.color}`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold">{loading ? "—" : s.value}</p>
              <p className="text-sm font-medium opacity-80">{s.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Today's Schedule */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Today&apos;s Schedule</h2>
            <Link href="/doctor/schedule" className="text-sm text-sky-600 hover:underline">View all</Link>
          </div>
          {loading ? <p className="text-gray-400 text-sm text-center py-6">Loading...</p> :
            todayList.length === 0 ? <p className="text-gray-400 text-sm text-center py-6">No appointments today</p> : (
              <div className="space-y-3">
                {todayList.map((appt) => (
                  <div key={appt._id} className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg border border-sky-100">
                    <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {appt.tokenNumber || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{appt.patientId?.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{appt.patientId?.patientId || appt.patientId?.phone || ""}</p>
                      <p className="text-xs text-sky-600 font-semibold">
                        {new Date(appt.appointmentDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                    {/* 3 Action Buttons */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => openRx(appt)} title="Write Prescription"
                        className="w-8 h-8 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold transition-colors">
                        📋
                      </button>
                      <button onClick={() => handleDone(appt)} title="Done - Patient seen"
                        className="w-8 h-8 bg-green-100 text-green-600 hover:bg-green-200 rounded-full flex items-center justify-center text-sm font-bold transition-colors">
                        ✓
                      </button>
                      <button onClick={() => updateStatus(appt._id, "No-Show")} title="No-Show"
                        className="w-8 h-8 bg-red-100 text-red-500 hover:bg-red-200 rounded-full flex items-center justify-center text-sm font-bold transition-colors">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Later Schedule */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-800">Later Schedule</h2>
              <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{laterCount} total</span>
            </div>
            <Link href="/doctor/schedule" className="text-sm text-sky-600 hover:underline">View all</Link>
          </div>
          {loading ? <p className="text-gray-400 text-sm text-center py-6">Loading...</p> :
            laterList.length === 0 ? <p className="text-gray-400 text-sm text-center py-6">No upcoming appointments</p> : (
              <div className="space-y-3">
                {laterList.map((appt) => {
                  const apptDate = new Date(appt.appointmentDate);
                  const now = new Date(); now.setHours(0, 0, 0, 0);
                  const diffDays = Math.ceil((apptDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={appt._id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {appt.tokenNumber || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{appt.patientId?.name}</p>
                        <p className="text-xs text-gray-500">{apptDate.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                      </div>
                      <span className="text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full flex-shrink-0">
                        {diffDays === 1 ? "Tomorrow" : `+${diffDays} days`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Write Prescription", href: "/doctor/prescriptions", icon: "💊", color: "bg-blue-50 text-blue-600" },
            { label: "View Lab Reports", href: "/doctor/lab-reports", icon: "🔬", color: "bg-red-50 text-red-600" },
            { label: "My Patients", href: "/doctor/patients", icon: "🧑‍⚕️", color: "bg-green-50 text-green-600" },
            { label: "My Schedule", href: "/doctor/schedule", icon: "📅", color: "bg-sky-50 text-sky-600" },
          ].map((action) => (
            <Link key={action.href} href={action.href} className={`p-4 rounded-xl ${action.color} hover:opacity-80 transition-opacity`}>
              <div className="text-2xl mb-1">{action.icon}</div>
              <p className="text-sm font-medium">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Prescription Modal */}
      {rxAppt && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-6">

            {/* Prescription Header */}
            <div className="p-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Write Prescription</h2>
                <p className="text-xs text-gray-500 mt-0.5">{rxAppt.patientId.name} · <span className="font-mono">{rxAppt.patientId.patientId || ""}</span></p>
              </div>
              <button onClick={() => setRxAppt(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {savedRx ? (
              /* Printable Prescription */
              <div className="p-6">
                <div id="rx-print" className="border border-gray-200 rounded-xl p-6 space-y-4">
                  {/* Hospital Header */}
                  <div className="text-center border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-black text-sky-700">MediCare Hospital</h2>
                    <p className="text-xs text-gray-500">1/A CIT Road, Kankurgachi, Kolkata — 700054</p>
                    <p className="text-xs text-gray-500">📞 +91-12345-67890 | info@medicare.com</p>
                  </div>

                  {/* Rx ID + Date */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="font-mono font-bold text-sky-600">Rx ID: {String((savedRx as Record<string,unknown>).rxId || "—")}</span>
                    <span>{new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                  </div>

                  {/* Patient + Doctor Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Patient</p>
                      <p className="font-semibold text-gray-800">{rxAppt.patientId.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{rxAppt.patientId.patientId || ""}</p>
                      {rxAppt.patientId.phone && <p className="text-xs text-gray-500">📞 {rxAppt.patientId.phone}</p>}
                      {rxAppt.patientId.gender && <p className="text-xs text-gray-500">Gender: {rxAppt.patientId.gender}</p>}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Doctor</p>
                      <p className="font-semibold text-gray-800">Dr. (Logged In)</p>
                      <p className="text-xs text-gray-500">MediCare Hospital</p>
                      <p className="text-xs text-gray-500">Date: {new Date(rxAppt.appointmentDate).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Diagnosis</p>
                    <p className="text-sm font-medium text-gray-800">{rxForm.diagnosis}</p>
                  </div>

                  {/* Medicines */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Medicines</p>
                    <div className="space-y-2">
                      {rxForm.medicines.map((m, i) => (
                        <div key={i} className="flex gap-3 text-sm bg-blue-50 rounded-lg p-2.5">
                          <span className="font-bold text-gray-800 min-w-[120px]">💊 {m.medicineName}</span>
                          <span className="text-gray-600">{m.dosage}</span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-600">{m.frequency}</span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-600">{m.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {rxForm.notes && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Notes</p>
                      <p className="text-sm text-gray-600 italic">{rxForm.notes}</p>
                    </div>
                  )}

                  <div className="border-t border-dashed border-gray-200 pt-3 text-center text-xs text-gray-400">
                    This is a computer-generated prescription — MediCare Hospital
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button onClick={() => window.print()} className="btn-primary flex-1 py-2.5">🖨️ Print</button>
                  <button onClick={() => setRxAppt(null)} className="btn-secondary flex-1 py-2.5">Close</button>
                </div>
              </div>
            ) : (
              /* Prescription Form */
              <form onSubmit={savePrescription} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis <span className="text-red-500">*</span></label>
                  <input className="input" placeholder="e.g. Viral fever, Hypertension" value={rxForm.diagnosis}
                    onChange={(e) => setRxForm((p) => ({ ...p, diagnosis: e.target.value }))} required />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Medicines</label>
                    <button type="button" onClick={() => setRxForm((p) => ({ ...p, medicines: [...p.medicines, { ...emptyMed }] }))}
                      className="text-xs text-sky-600 hover:text-sky-800 font-semibold">+ Add Medicine</button>
                  </div>
                  <div className="space-y-3">
                    {rxForm.medicines.map((med, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="col-span-2">
                            <input className="input text-sm" placeholder="Medicine name" value={med.medicineName}
                              onChange={(e) => updateMed(i, "medicineName", e.target.value)} required />
                          </div>
                          <input className="input text-sm" placeholder="Dosage (e.g. 500mg)" value={med.dosage}
                            onChange={(e) => updateMed(i, "dosage", e.target.value)} required />
                          <input className="input text-sm" placeholder="Frequency (e.g. 2x daily)" value={med.frequency}
                            onChange={(e) => updateMed(i, "frequency", e.target.value)} required />
                          <input className="input text-sm col-span-2" placeholder="Duration (e.g. 5 days)" value={med.duration}
                            onChange={(e) => updateMed(i, "duration", e.target.value)} required />
                        </div>
                        {rxForm.medicines.length > 1 && (
                          <button type="button" onClick={() => setRxForm((p) => ({ ...p, medicines: p.medicines.filter((_, j) => j !== i) }))}
                            className="text-xs text-red-500 hover:text-red-700 mt-2">Remove</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea className="input resize-none" rows={2} placeholder="Additional instructions" value={rxForm.notes}
                    onChange={(e) => setRxForm((p) => ({ ...p, notes: e.target.value }))} />
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5">
                    {saving ? "Saving..." : "Save Prescription"}
                  </button>
                  <button type="button" onClick={() => setRxAppt(null)} className="btn-secondary flex-1 py-2.5">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
