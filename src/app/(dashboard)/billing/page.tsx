"use client";
import { useState, useEffect } from "react";

interface Notification {
  _id: string;
  message: string;
  patientId: { name: string; patientId?: string };
  isRead: boolean;
  createdAt: string;
}

export default function BillingDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => { if (d.success) setNotifications(d.data); setLoading(false); });
  }, []);

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
  }

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Billing & payments management</p>
      </div>

      {/* Notifications */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-semibold text-gray-800">Bill Requests</h2>
          {unread > 0 && (
            <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unread} new</span>
          )}
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm text-center py-6">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🔔</div>
            <p className="text-sm">No bill requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n._id} className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${n.isRead ? "bg-gray-50 border-gray-100" : "bg-amber-50 border-amber-200"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${n.isRead ? "bg-gray-100" : "bg-amber-100"}`}>
                  🧾
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.isRead ? "text-gray-600" : "text-gray-800 font-medium"}`}>{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                {!n.isRead && (
                  <button onClick={() => markRead(n._id)}
                    className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-medium flex-shrink-0">
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card text-center py-12 text-gray-400">
        <div className="text-5xl mb-3">🧾</div>
        <p className="text-lg font-medium">More billing features coming soon</p>
      </div>
    </div>
  );
}
