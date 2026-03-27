"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ROLE_DASHBOARDS, UserRole } from "@/types";

const PORTAL_INFO: Record<string, { label: string; icon: string; subtitle: string; color: string; bg: string }> = {
  Admin: { label: "Admin Portal", icon: "🛡️", subtitle: "Hospital administration access", color: "#7c3aed", bg: "#f5f3ff" },
  Doctor: { label: "Doctor Portal", icon: "👨⚕️", subtitle: "Clinical dashboard access", color: "#0284c7", bg: "#e0f2fe" },
  Patient: { label: "Patient Portal", icon: "🧑⚕️", subtitle: "Your health records & appointments", color: "#059669", bg: "#d1fae5" },
  Reception: { label: "Staff Portal", icon: "S", subtitle: "Select your staff role below", color: "#d97706", bg: "#fef3c7" },
  Pharmacy: { label: "Pharmacy Portal", icon: "💊", subtitle: "Medicine & inventory management", color: "#dc2626", bg: "#fee2e2" },
  Lab: { label: "Lab Portal", icon: "🔬", subtitle: "Diagnostics & reports", color: "#0891b2", bg: "#cffafe" },
};

const STAFF_ROLES = [
  { role: "Reception", label: "Reception", icon: "R", color: "#d97706", bg: "#fef3c7" },
  { role: "Billing", label: "Billing", icon: "💰", color: "#059669", bg: "#d1fae5" },
  { role: "Pharmacy", label: "Pharmacy", icon: "💊", color: "#dc2626", bg: "#fee2e2" },
  { role: "Lab", label: "Lab", icon: "🔬", color: "#0891b2", bg: "#cffafe" },
  { role: "Security", label: "Security", icon: "🔒", color: "#64748b", bg: "#f1f5f9" },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portalParam = searchParams.get("portal") || "";

  const [selectedStaffRole, setSelectedStaffRole] = useState("");
  const [form, setForm] = useState({ email: "", password: "", doctorId: "", staffId: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const portal = PORTAL_INFO[portalParam];
  const isDoctor = portalParam === "Doctor";
  const isStaff = portalParam === "Reception";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Login failed"); return; }
    router.push(ROLE_DASHBOARDS[data.user.role as UserRole]);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <span className="text-xl font-black text-gray-900">MediCare</span>
          </Link>
          {portal ? (
            <div>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3" style={{ backgroundColor: portal.bg }}>
                {portal.icon}
              </div>
              <h1 className="text-2xl font-black" style={{ color: portal.color }}>{portal.label}</h1>
              <p className="text-sm mt-1 text-gray-500">{portal.subtitle}</p>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-black text-gray-900">Welcome Back</h1>
              <p className="text-sm mt-1 text-gray-500">Sign in to your portal</p>
            </div>
          )}
        </div>

        {/* Staff Role Selection */}
        {isStaff && !selectedStaffRole && (
          <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-400">Select Your Role</p>
            <div className="flex flex-col gap-2">
              {STAFF_ROLES.map((s) => (
                <button key={s.role} onClick={() => setSelectedStaffRole(s.role)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all hover:shadow-sm"
                  style={{ border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = s.bg; e.currentTarget.style.borderColor = s.color + "40"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: s.bg }}>{s.icon}</div>
                  <span className="font-semibold text-sm text-gray-700">{s.label}</span>
                  <span className="ml-auto text-xs text-gray-400">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Login Form */}
        {(!isStaff || selectedStaffRole) && (
          <div className="bg-white rounded-2xl p-8" style={{ border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {isStaff && selectedStaffRole && (
              <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ backgroundColor: STAFF_ROLES.find(s => s.role === selectedStaffRole)?.bg }}>
                    {STAFF_ROLES.find(s => s.role === selectedStaffRole)?.icon}
                  </div>
                  <span className="font-bold text-sm text-gray-800">{selectedStaffRole}</span>
                </div>
                <button onClick={() => setSelectedStaffRole("")} className="text-xs font-medium text-sky-500 hover:text-sky-700">Change</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isDoctor && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-500">Doctor ID</label>
                  <input className="input" placeholder="e.g. 1, 2, 3..." value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required />
                </div>
              )}
              {isStaff && selectedStaffRole && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-500">Staff ID</label>
                  <input className="input" placeholder="e.g. 1, 2, 3..." value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })} required />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-500">Email Address</label>
                <input type="email" className="input" placeholder="you@hospital.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-500">Password</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} className="input" style={{ paddingRight: "60px" }} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-sky-500 hover:text-sky-700">
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full font-bold py-3.5 rounded-xl text-sm text-white mt-2 transition-all"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)", boxShadow: "0 4px 16px rgba(14,165,233,0.3)" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm mt-6">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
