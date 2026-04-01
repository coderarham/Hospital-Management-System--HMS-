"use client";
import { useState, useEffect } from "react";

interface PatientInfo { _id: string; name: string; email?: string; phone?: string; patientId?: string; gender?: string; dateOfBirth?: string; address?: string; state?: string; city?: string; }
interface Appointment {
  _id: string;
  patientId: PatientInfo;
  appointmentDate: string;
  status: string;
  symptoms?: string;
  tokenNumber?: number;
}
interface Medicine { medicineName: string; dosage: string; frequency: string; duration: string; }
interface Prescription { _id: string; diagnosis?: string; notes?: string; medicines: Medicine[]; createdAt: string; }

const statusColors: Record<string, string> = {
  Scheduled: "bg-sky-100 text-sky-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  "No-Show": "bg-gray-100 text-gray-700",
};

const emptyMed: Medicine = { medicineName: "", dosage: "", frequency: "", duration: "" };

export default function DoctorSchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"today" | "later">("today");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [modalTab, setModalTab] = useState<"details" | "prescription" | "history">("details");
  const [history, setHistory] = useState<Prescription[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [rxForm, setRxForm] = useState({ diagnosis: "", notes: "", medicines: [{ ...emptyMed }] });
  const [saving, setSaving] = useState(false);
  const [rxSuccess, setRxSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((d) => { if (d.success) setAppointments(d.data); setLoading(false); });
  }, []);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  const todayList = appointments.filter((a) => {
    const d = new Date(a.appointmentDate);
    return d >= today && d < tomorrow;
  });
  const laterList = appointments.filter((a) => new Date(a.appointmentDate) >= tomorrow);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    if (selected?._id === id) setSelected((p) => p ? { ...p, status } : p);
  }

  async function openPatient(appt: Appointment) {
    setSelected(appt);
    setModalTab("details");
    setRxForm({ diagnosis: "", notes: "", medicines: [{ ...emptyMed }] });
    setRxSuccess(false);
  }

  async function loadHistory(patientId: string) {
    setHistLoading(true);
    const res = await fetch(`/api/prescriptions?patientId=${patientId}`);
    const data = await res.json();
    if (data.success) setHistory(data.data);
    setHistLoading(false);
  }

  function handleModalTab(t: "details" | "prescription" | "history") {
    setModalTab(t);
    if (t === "history" && selected) loadHistory(selected.patientId._id);
  }

  function updateMed(i: number, field: keyof Medicine, val: string) {
    setRxForm((p) => {
      const meds = [...p.medicines];
      meds[i] = { ...meds[i], [field]: val };
      return { ...p, medicines: meds };
    });
  }

  async function savePrescription(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    await fetch("/api/prescriptions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: selected._id, patientId: selected.patientId._id, ...rxForm }),
    });
    setSaving(false);
    setRxSuccess(true);
    setRxForm({ diagnosis: "", notes: "", medicines: [{ ...emptyMed }] });
  }

  const displayList = tab === "today" ? todayList : laterList;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">Click on a patient to view details & write prescription</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("today")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "today" ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Today&apos;s Schedule
          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === "today" ? "bg-white/20 text-white" : "bg-sky-100 text-sky-600"}`}>{todayList.length}</span>
        </button>
        <button
          onClick={() => setTab("later")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "later" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Later Schedule
          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === "later" ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"}`}>{laterList.length}</span>
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Token</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Patient</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Date & Time</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Symptoms</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : displayList.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No appointments {tab === "today" ? "today" : "scheduled later"}</td></tr>
              ) : displayList.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openPatient(a)}>
                  <td className="px-6 py-4">
                    <span className="w-7 h-7 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {a.tokenNumber || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{a.patientId?.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{a.patientId?.patientId || a.patientId?.phone || "—"}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(a.appointmentDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-[150px] truncate">{a.symptoms || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${statusColors[a.status]}`}>{a.status}</span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    {a.status === "Scheduled" && (
                      <div className="flex gap-1">
                        <button onClick={() => updateStatus(a._id, "Completed")} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Done</button>
                        <button onClick={() => updateStatus(a._id, "No-Show")} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">No-Show</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-6">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-gray-900">{selected.patientId.name}</h2>
                  {selected.patientId.patientId && (
                    <span className="text-xs font-mono font-bold bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full">{selected.patientId.patientId}</span>
                  )}
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>{selected.status}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Token #{selected.tokenNumber} · {new Date(selected.appointmentDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl ml-4">✕</button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-100">
              {(["details", "prescription", "history"] as const).map((t) => (
                <button key={t} onClick={() => handleModalTab(t)}
                  className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${modalTab === t ? "border-b-2 border-sky-500 text-sky-600" : "text-gray-500 hover:text-gray-700"}`}>
                  {t === "details" ? "Patient Details" : t === "prescription" ? "Write Prescription" : "History"}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Details Tab */}
              {modalTab === "details" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ["Patient ID", selected.patientId.patientId],
                      ["Phone", selected.patientId.phone],
                      ["Email", selected.patientId.email],
                      ["Gender", selected.patientId.gender],
                      ["Date of Birth", selected.patientId.dateOfBirth ? new Date(selected.patientId.dateOfBirth).toLocaleDateString("en-IN") : null],
                      ["Address", selected.patientId.address],
                      ["State", selected.patientId.state],
                      ["City", selected.patientId.city],
                    ].map(([label, val]) => val ? (
                      <div key={label}>
                        <p className="text-xs text-gray-400 font-medium">{label}</p>
                        <p className="text-gray-800 font-medium">{val}</p>
                      </div>
                    ) : null)}
                  </div>
                  {selected.symptoms && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <p className="text-xs text-amber-600 font-semibold mb-1">Symptoms / Reason</p>
                      <p className="text-sm text-gray-700">{selected.symptoms}</p>
                    </div>
                  )}
                  {selected.status === "Scheduled" && (
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => updateStatus(selected._id, "Completed")} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold">Mark Completed</button>
                      <button onClick={() => updateStatus(selected._id, "No-Show")} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold">No-Show</button>
                    </div>
                  )}
                </div>
              )}

              {/* Prescription Tab */}
              {modalTab === "prescription" && (
                <form onSubmit={savePrescription} className="space-y-4">
                  {rxSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                      ✅ Prescription saved successfully!
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                    <input className="input" placeholder="e.g. Viral fever, Hypertension" value={rxForm.diagnosis} onChange={(e) => setRxForm((p) => ({ ...p, diagnosis: e.target.value }))} required />
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
                              <input className="input text-sm" placeholder="Medicine name" value={med.medicineName} onChange={(e) => updateMed(i, "medicineName", e.target.value)} required />
                            </div>
                            <input className="input text-sm" placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={(e) => updateMed(i, "dosage", e.target.value)} required />
                            <input className="input text-sm" placeholder="Frequency (e.g. 2x daily)" value={med.frequency} onChange={(e) => updateMed(i, "frequency", e.target.value)} required />
                            <input className="input text-sm col-span-2" placeholder="Duration (e.g. 5 days)" value={med.duration} onChange={(e) => updateMed(i, "duration", e.target.value)} required />
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
                    <textarea className="input resize-none" rows={2} placeholder="Additional notes or instructions" value={rxForm.notes} onChange={(e) => setRxForm((p) => ({ ...p, notes: e.target.value }))} />
                  </div>

                  <button type="submit" disabled={saving} className="btn-primary w-full py-2.5">
                    {saving ? "Saving..." : "Save Prescription"}
                  </button>
                </form>
              )}

              {/* History Tab */}
              {modalTab === "history" && (
                <div>
                  {histLoading ? (
                    <p className="text-center text-gray-400 py-8">Loading history...</p>
                  ) : history.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No prescription history found</p>
                  ) : (
                    <div className="space-y-4">
                      {history.map((rx) => (
                        <div key={rx._id} className="p-4 border border-gray-100 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-800">{rx.diagnosis || "No diagnosis"}</p>
                            <p className="text-xs text-gray-400">{new Date(rx.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                          </div>
                          <div className="space-y-1">
                            {rx.medicines.map((m, i) => (
                              <div key={i} className="text-xs text-gray-600 flex gap-2 flex-wrap">
                                <span className="font-semibold text-gray-800">💊 {m.medicineName}</span>
                                <span>{m.dosage}</span>
                                <span>·</span>
                                <span>{m.frequency}</span>
                                <span>·</span>
                                <span>{m.duration}</span>
                              </div>
                            ))}
                          </div>
                          {rx.notes && <p className="text-xs text-gray-500 mt-2 italic">{rx.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
