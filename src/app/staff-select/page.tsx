import Link from "next/link";

const staffRoles = [
  { role: "Reception", icon: "R", color: "#d97706", bg: "#fef3c7", desc: "Front desk operations" },
  { role: "Billing", icon: "💰", color: "#059669", bg: "#d1fae5", desc: "Billing & payments" },
  { role: "Pharmacy", icon: "💊", color: "#dc2626", bg: "#fee2e2", desc: "Medicine & inventory" },
  { role: "Security", icon: "🔒", color: "#64748b", bg: "#f1f5f9", desc: "Hospital security" },
];

export default function StaffSelectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <span className="text-xl font-black text-gray-900">MediCare</span>
          </Link>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>S</div>
          <h1 className="text-2xl font-black" style={{ color: "#d97706" }}>Staff Portal</h1>
          <p className="text-sm mt-1 text-gray-500">Select your staff role to continue</p>
        </div>

        <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-400">Select Your Role</p>
          <div className="flex flex-col gap-2">
            {staffRoles.map((s) => (
              <Link key={s.role} href={`/login?portal=${s.role}`}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                style={{ border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = s.bg; (e.currentTarget as HTMLElement).style.borderColor = s.color + "40"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f8fafc"; (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: s.bg }}>{s.icon}</div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{s.role}</p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">→</span>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-center text-sm mt-6">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
