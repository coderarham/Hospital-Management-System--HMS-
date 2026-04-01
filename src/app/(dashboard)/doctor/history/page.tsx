"use client";
import { useState, useEffect } from "react";

interface Medicine { medicineName: string; dosage: string; frequency: string; duration: string; }
interface Prescription {
  _id: string;
  rxId?: string;
  patientId: { name: string; patientId?: string; phone?: string };
  diagnosis?: string;
  notes?: string;
  medicines: Medicine[];
  createdAt: string;
}

const emptyMed: Medicine = { medicineName: "", dosage: "", frequency: "", duration: "" };

export default function DoctorHistoryPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ diagnosis: string; notes: string; medicines: Medicine[] }>({ diagnosis: "", notes: "", medicines: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/prescriptions")
      .then((r) => r.json())
      .then((d) => { if (d.success) setPrescriptions(d.data); setLoading(false); });
  }, []);

  const filtered = prescriptions.filter((rx) =>
    rx.patientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    (rx.patientId?.patientId || "").toLowerCase().includes(search.toLowerCase()) ||
    (rx.diagnosis || "").toLowerCase().includes(search.toLowerCase())
  );

  function startEdit(rx: Prescription) {
    setEditId(rx._id);
    setEditForm({
      diagnosis: rx.diagnosis || "",
      notes: rx.notes || "",
      medicines: rx.medicines.map((m) => ({ ...m })),
    });
  }

  function cancelEdit() {
    setEditId(null);
  }

  function updateMed(i: number, field: keyof Medicine, val: string) {
    setEditForm((p) => {
      const m = [...p.medicines];
      m[i] = { ...m[i], [field]: val };
      return { ...p, medicines: m };
    });
  }

  async function saveEdit(id: string) {
    setSaving(true);
    const res = await fetch(`/api/prescriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setPrescriptions((prev) =>
        prev.map((rx) => rx._id === id ? { ...rx, ...editForm } : rx)
      );
      setEditId(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient History</h1>
        <p className="text-sm text-gray-500 mt-1">All prescriptions you have written</p>
      </div>

      <div className="card mb-5">
        <input
          className="input"
          placeholder="Search by patient name, ID or diagnosis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="card text-center py-10 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">No history found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((rx) => (
            <div key={rx._id} className="card p-0 overflow-hidden">
              {/* Card Header */}
              <button
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                onClick={() => { setExpanded(expanded === rx._id ? null : rx._id); if (editId === rx._id) setEditId(null); }}
              >
                <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-base flex-shrink-0">📋</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-800">{rx.patientId?.name}</p>
                    {rx.patientId?.patientId && (
                      <span className="text-xs font-mono bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">{rx.patientId.patientId}</span>
                    )}
                    {rx.rxId && (
                      <span className="text-xs font-mono bg-sky-100 text-sky-600 px-1.5 py-0.5 rounded">{rx.rxId}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{rx.diagnosis || "No diagnosis"}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">{new Date(rx.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{rx.medicines.length} medicine{rx.medicines.length !== 1 ? "s" : ""}</p>
                </div>
                <span className="text-gray-400 ml-2">{expanded === rx._id ? "▲" : "▼"}</span>
              </button>

              {/* Expanded View */}
              {expanded === rx._id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  {editId === rx._id ? (
                    /* Edit Mode */
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Diagnosis</label>
                        <input className="input text-sm" value={editForm.diagnosis}
                          onChange={(e) => setEditForm((p) => ({ ...p, diagnosis: e.target.value }))} />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Medicines</label>
                          <button type="button" onClick={() => setEditForm((p) => ({ ...p, medicines: [...p.medicines, { ...emptyMed }] }))}
                            className="text-xs text-sky-600 hover:text-sky-800 font-semibold">+ Add</button>
                        </div>
                        <div className="space-y-2">
                          {editForm.medicines.map((m, i) => (
                            <div key={i} className="p-3 bg-white rounded-lg border border-gray-200">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                  <input className="input text-sm" placeholder="Medicine name" value={m.medicineName}
                                    onChange={(e) => updateMed(i, "medicineName", e.target.value)} />
                                </div>
                                <input className="input text-sm" placeholder="Dosage" value={m.dosage}
                                  onChange={(e) => updateMed(i, "dosage", e.target.value)} />
                                <input className="input text-sm" placeholder="Frequency" value={m.frequency}
                                  onChange={(e) => updateMed(i, "frequency", e.target.value)} />
                                <input className="input text-sm col-span-2" placeholder="Duration" value={m.duration}
                                  onChange={(e) => updateMed(i, "duration", e.target.value)} />
                              </div>
                              {editForm.medicines.length > 1 && (
                                <button type="button" onClick={() => setEditForm((p) => ({ ...p, medicines: p.medicines.filter((_, j) => j !== i) }))}
                                  className="text-xs text-red-500 hover:text-red-700 mt-2">Remove</button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</label>
                        <textarea className="input resize-none text-sm" rows={2} value={editForm.notes}
                          onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))} />
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(rx._id)} disabled={saving}
                          className="btn-primary flex-1 py-2 text-sm">
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button onClick={cancelEdit} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="space-y-3">
                      {rx.patientId?.phone && (
                        <p className="text-xs text-gray-500">📞 {rx.patientId.phone}</p>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Medicines</p>
                        <div className="space-y-2">
                          {rx.medicines.map((m, i) => (
                            <div key={i} className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm bg-white p-2.5 rounded-lg border border-gray-100">
                              <span className="font-semibold text-gray-800">💊 {m.medicineName}</span>
                              <span className="text-gray-500">{m.dosage}</span>
                              <span className="text-gray-400">·</span>
                              <span className="text-gray-500">{m.frequency}</span>
                              <span className="text-gray-400">·</span>
                              <span className="text-gray-500">{m.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {rx.notes && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                          <p className="text-sm text-gray-600 italic">{rx.notes}</p>
                        </div>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); startEdit(rx); }}
                        className="text-xs bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg font-medium transition-colors">
                        ✏️ Edit Prescription
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
