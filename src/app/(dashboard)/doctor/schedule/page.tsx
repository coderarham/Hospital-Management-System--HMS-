"use client";
import { useState, useEffect } from "react";

interface Appointment {
  _id: string;
  patientId: { name: string; email: string; phone?: string };
  appointmentDate: string;
  status: string;
  symptoms?: string;
  tokenNumber?: number;
}

export default function DoctorSchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((d) => { if (d.success) setAppointments(d.data); setLoading(false); });
  }, []);

  const statusColors: Record<string, string> = {
    Scheduled: "bg-sky-100 text-sky-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    "No-Show": "bg-gray-100 text-gray-700",
  };

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">All your appointments</p>
      </div>

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
              ) : appointments.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No appointments found</td></tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="w-7 h-7 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {a.tokenNumber || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{a.patientId?.name}</p>
                      <p className="text-xs text-gray-400">{a.patientId?.phone || a.patientId?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(a.appointmentDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-[150px] truncate">{a.symptoms || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${statusColors[a.status]}`}>{a.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      {a.status === "Scheduled" && (
                        <div className="flex gap-1">
                          <button onClick={() => updateStatus(a._id, "Completed")} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Done</button>
                          <button onClick={() => updateStatus(a._id, "No-Show")} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">No-Show</button>
                        </div>
                      )}
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
