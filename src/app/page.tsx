import Link from "next/link";
import LoginDropdown from "@/components/ui/LoginDropdown";
import Footer from "@/components/layout/Footer";

const services = [
  { icon: "🫀", name: "Cardiology", desc: "Heart & cardiovascular care" },
  { icon: "🧠", name: "Neurology", desc: "Brain & nervous system" },
  { icon: "🦴", name: "Orthopedics", desc: "Bones, joints & muscles" },
  { icon: "👶", name: "Pediatrics", desc: "Child healthcare" },
  { icon: "🔬", name: "Pathology", desc: "Lab tests & diagnostics" },
  { icon: "🩻", name: "Radiology", desc: "X-Ray, MRI & CT Scan" },
];

const stats = [
  { value: "500+", label: "Expert Doctors" },
  { value: "50K+", label: "Patients Served" },
  { value: "24/7", label: "Emergency Care" },
  { value: "30+", label: "Departments" },
];

const portals = [
  { role: "Admin", icon: "🛡️", href: "/login?portal=Admin", color: "#7c3aed", bg: "#f5f3ff" },
  { role: "Doctor", icon: "👨⚕️", href: "/login?portal=Doctor", color: "#0284c7", bg: "#e0f2fe" },
  { role: "Patient", icon: "🧑⚕️", href: "/login?portal=Patient", color: "#059669", bg: "#d1fae5" },
  { role: "Staff", icon: "S", href: "/login?portal=Reception", color: "#d97706", bg: "#fef3c7" },
  { role: "Pharmacy", icon: "💊", href: "/login?portal=Pharmacy", color: "#dc2626", bg: "#fee2e2" },
  { role: "Lab", icon: "🔬", href: "/login?portal=Lab", color: "#0891b2", bg: "#cffafe" },
];

export default function HomePage() {
  return (
    <>
      <style>{`
        body { background-color: #f8fafc; }
        .hov-service:hover { border-color: #0ea5e9 !important; box-shadow: 0 4px 20px rgba(14,165,233,0.1); transform: translateY(-2px); }
        .hov-portal:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .nav-link { color: #64748b; transition: all 0.2s; font-size: 14px; font-weight: 500; padding: 6px 12px; border-radius: 8px; border: 1px solid transparent; }
        .nav-link:hover { color: #0284c7; background-color: #f0f9ff; border-color: #bae6fd; }
        .service-card { transition: all 0.2s; }
        .portal-card { transition: all 0.2s; }
      `}</style>

      <div style={{ backgroundColor: "#f8fafc", color: "#0f172a" }}>

        {/* Navbar */}
        <nav style={{ backgroundColor: "rgba(255,255,255,0.9)", borderBottom: "1px solid #e2e8f0", backdropFilter: "blur(12px)" }} className="sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div>
                <span className="text-lg font-black text-gray-900">MediCare</span>
                <span className="text-xs text-gray-400 ml-2 hidden sm:inline">Hospital Management</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="/" className="nav-link">Home</a>
              <Link href="/doctors" className="nav-link">Doctors</Link>
              <a href="/services" className="nav-link">Services</a>
              <a href="/#about" className="nav-link">About</a>
              <a href="/#contact" className="nav-link">Contact</a>
            </div>
            <LoginDropdown />
          </div>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)" }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 40%)" }} />
          <div className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)", color: "#38bdf8" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                Emergency: +91-1800-MEDICARE
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5 text-white">
                Advanced Care,<br />
                <span style={{ color: "#38bdf8" }}>Trusted Healing</span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                World-class healthcare with compassionate doctors, cutting-edge technology, and 24/7 emergency services.
              </p>
              <div className="flex gap-3">
                <a href="#portals" className="font-semibold px-6 py-3 rounded-xl text-sm text-white transition-all" style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)", boxShadow: "0 4px 20px rgba(14,165,233,0.4)" }}>
                  Access Portal
                </a>
                <a href="#services" className="font-semibold px-6 py-3 rounded-xl text-sm transition-all" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  Our Services
                </a>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl p-6 text-center" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                  <div className="text-3xl font-black mb-1" style={{ color: "#38bdf8" }}>{s.value}</div>
                  <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="px-6 py-20" style={{ backgroundColor: "#f8fafc" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#0284c7", backgroundColor: "#e0f2fe" }}>Specialties</span>
              <h2 className="text-3xl font-black mt-3 text-gray-900">Medical Departments</h2>
              <p className="text-sm mt-2 text-gray-500">Expert care across all major medical disciplines</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {services.map((s) => (
                <div key={s.name} className="service-card hov-service bg-white rounded-2xl p-5 text-center cursor-pointer" style={{ border: "1px solid #e2e8f0" }}>
                  <div className="text-4xl mb-3">{s.icon}</div>
                  <div className="font-bold text-sm text-gray-800">{s.name}</div>
                  <div className="text-xs mt-1 text-gray-400 leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="px-6 py-20" style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#0284c7", backgroundColor: "#e0f2fe" }}>About Us</span>
              <h2 className="text-3xl font-black mt-3 mb-5 text-gray-900">25 Years of Medical Excellence</h2>
              <p className="text-gray-500 leading-relaxed mb-4 text-sm">
                MediCare Hospital is a leading multi-specialty hospital committed to providing world-class healthcare services since 2000. With over 500 experienced doctors and state-of-the-art technology, we serve thousands of patients every year.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8 text-sm">
                Our mission is to deliver compassionate, affordable, and high-quality medical care to every patient who walks through our doors.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🏆", title: "25+ Years", desc: "Of Excellence", color: "#fef3c7" },
                  { icon: "👨⚕️", title: "500+ Doctors", desc: "Expert Specialists", color: "#dbeafe" },
                  { icon: "🏥", title: "30+ Departments", desc: "All Specialties", color: "#d1fae5" },
                  { icon: "❤️", title: "50K+ Patients", desc: "Treated Annually", color: "#fee2e2" },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: item.color }}>
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🚑", title: "24/7 Emergency", desc: "Round the clock emergency care with rapid response teams", color: "#0ea5e9" },
                { icon: "🔬", title: "Advanced Lab", desc: "State-of-the-art diagnostic and pathology services", color: "#8b5cf6" },
                { icon: "💊", title: "In-house Pharmacy", desc: "Fully stocked pharmacy with all prescribed medicines", color: "#10b981" },
                { icon: "🩺", title: "Expert Doctors", desc: "Highly qualified specialists across all departments", color: "#f59e0b" },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #e2e8f0" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ backgroundColor: `${item.color}15` }}>{item.icon}</div>
                  <h4 className="font-bold text-sm mb-1 text-gray-800">{item.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portals */}
        <section id="portals" className="px-6 py-20" style={{ backgroundColor: "#f8fafc" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#0284c7", backgroundColor: "#e0f2fe" }}>Portals</span>
              <h2 className="text-3xl font-black mt-3 text-gray-900">Access Your Dashboard</h2>
              <p className="text-sm mt-2 text-gray-500">Login to your dedicated portal</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {portals.map((p) => (
                <Link key={p.role} href={p.href} className="portal-card hov-portal bg-white rounded-2xl p-6 text-center block" style={{ border: "1px solid #e2e8f0" }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3" style={{ backgroundColor: p.bg }}>
                    {p.icon}
                  </div>
                  <div className="font-bold text-sm text-gray-800">{p.role}</div>
                  <div className="text-xs mt-1 font-medium" style={{ color: p.color }}>Portal →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />

      </div>
    </>
  );
}
