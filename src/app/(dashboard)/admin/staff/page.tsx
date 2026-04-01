"use client";
import { useState, useEffect, useCallback } from "react";
import IndiaAddressFields from "@/components/ui/IndiaAddressFields";

interface Staff {
  _id: string;
  name: string;
  email?: string;
  role: string;
  phone?: string;
  isActive: boolean;
  gender?: string;
  shift?: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: string;
  staffId?: string;
  joiningDate?: string;
}

const ROLES = ["Reception", "Billing", "Pharmacy", "Lab", "Security"];
const SHIFTS = ["Morning (6AM - 2PM)", "Evening (2PM - 10PM)", "Night (10PM - 6AM)", "Full Day (9AM - 6PM)"];

const emptyForm = {
  name: "", email: "", password: "", phone: "", role: "Reception",
  gender: "", shift: "", address: "", state: "", city: "", pincode: "",
};

const roleColors: Record<string, string> = {
  Reception: "bg-amber-100 text-amber-700",
  Billing: "bg-green-100 text-green-700",
  Pharmacy: "bg-orange-100 text-orange-700",
  Lab: "bg-red-100 text-red-700",
  Security: "bg-gray-100 text-gray-700",
};

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [filterRole, setFilterRole] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    const url = filterRole ? `/api/admin/staff?role=${filterRole}` : "/api/admin/staff";
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) setStaff(data.data);
    setLoading(false);
  }, [filterRole]);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  function openAdd() {
    setEditStaff(null);
    setForm(emptyForm);
    setShowPwd(false);
    setError("");
    setShowForm(true);
  }

  function openEdit(s: Staff) {
    setEditStaff(s);
    setForm({
      name: s.name, email: s.email || "", password: "",
      phone: s.phone || "", role: s.role,
      gender: s.gender || "", shift: s.shift || "",
      address: s.address || "", state: s.state || "", city: s.city || "", pincode: s.pincode || "",
    });
    setShowPwd(false);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload: Record<string, unknown> = { ...form };
    if (!payload.email) delete payload.email;
    if (editStaff && !form.password) delete payload.password;

    const url = editStaff ? `/api/admin/staff/${editStaff._id}` : "/api/admin/staff";
    const method = editStaff ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(data.error); return; }
    setShowForm(false);
    fetchStaff();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchStaff();
  }

  const f = (field: string, val: string) => setForm((p) => ({ ...p, [field]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage hospital staff and roles</p>
        </div>
        <button onClick={openAdd} className="btn-primary">+ Add Staff</button>
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterRole("")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!filterRole ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All</button>
          {ROLES.map((r) => (
            <button key={r} onClick={() => setFilterRole(r)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterRole === r ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{r}</button>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editStaff ? "Edit Staff Member" : "Add New Staff Member"}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{editStaff ? `Editing ${editStaff.name}` : "Fill in the details below"}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Basic Information</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input className="input" placeholder="Full Name" value={form.name} onChange={(e) => f("name", e.target.value)} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                  <input className="input" type="email" placeholder="staff@hospital.com" value={form.email} onChange={(e) => f("email", e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                  <input className="input" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={(e) => f("phone", e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {!editStaff && <span className="text-red-500">*</span>}
                    {editStaff && <span className="text-xs text-gray-400 font-normal ml-1">(blank = nahi badlega)</span>}
                  </label>
                  <div className="relative">
                    <input
                      className="input pr-16"
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => f("password", e.target.value)}
                      required={!editStaff}
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-sky-600 font-medium hover:text-sky-800">
                      {showPwd ? "Hide" : "Show"}
                    </button>
                  </div>
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

                <div className="md:col-span-2 mt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Work Details</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift / Timing</label>
                  <select className="input" value={form.shift} onChange={(e) => f("shift", e.target.value)}>
                    <option value="">Select Shift</option>
                    {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
                  <select className="input" value={form.role} onChange={(e) => f("role", e.target.value)}>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                  <input className="input" placeholder="e.g. 400001" value={form.pincode} onChange={(e) => f("pincode", e.target.value)} />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="submit" disabled={submitting} className="btn-primary flex-1 py-2.5">
                  {submitting ? "Saving..." : editStaff ? "Save Changes" : "Add Staff"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <h3 className="font-bold text-gray-900 mb-1">Delete Staff Member?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium">Delete</button>
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Staff ID</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Role</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Shift</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Phone</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Gender</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : staff.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No staff found. Add one!</td></tr>
              ) : (
                staff.map((s, index) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-sky-600">{s.staffId || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.email || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${roleColors[s.role] || "bg-gray-100 text-gray-700"}`}>{s.role}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{s.shift || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{s.phone || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{s.gender || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${s.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(s)} className="text-xs bg-sky-50 text-sky-600 hover:bg-sky-100 px-3 py-1.5 rounded-lg font-medium">Edit</button>
                        <button onClick={() => setDeleteId(s._id)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium">Delete</button>
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
