import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Link from "next/link";
import LoginDropdown from "@/components/ui/LoginDropdown";
import Footer from "@/components/layout/Footer";

async function getDoctors() {
  await connectDB();
  const doctors = await User.find({ role: "Doctor", isActive: true })
    .select("name specialization experience departmentId gender phone")
    .populate("departmentId", "name")
    .lean();
  return doctors;
}

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <>
      <style>{`
        body { background-color: #f8fafc; }
        .nav-link { color: #64748b; transition: all 0.2s; font-size: 14px; font-weight: 500; padding: 6px 12px; border-radius: 8px; border: 1px solid transparent; }
        .nav-link:hover { color: #0284c7; background-color: #f0f9ff; border-color: #bae6fd; }
        .doc-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
      `}</style>

      <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>

        {/* Navbar */}
        <nav style={{ backgroundColor: "rgba(255,255,255,0.9)", borderBottom: "1px solid #e2e8f0", backdropFilter: "blur(12px)" }} className="sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-lg font-black text-gray-900">MediCare</span>
              <span className="text-xs text-gray-400 hidden sm:inline">Hospital Management</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/doctors" className="nav-link" style={{ color: "#0284c7", backgroundColor: "#f0f9ff", borderColor: "#bae6fd" }}>Doctors</Link>
              <Link href="/services" className="nav-link">Services</Link>
              <Link href="/#about" className="nav-link">About</Link>
              <Link href="/#contact" className="nav-link">Contact</Link>
            </div>
            <LoginDropdown />
          </div>
        </nav>

        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#0284c7", backgroundColor: "#e0f2fe" }}>Our Team</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mt-3">Meet Our Doctors</h1>
          <p className="text-sm text-gray-500 mt-2">Expert specialists dedicated to your health</p>
        </div>

        {/* Cards */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          {doctors.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">👨‍⚕️</div>
              <p className="text-gray-400 font-medium">No doctors found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {doctors.map((doc: Record<string, unknown>) => {
                const dept = doc.departmentId as { name: string } | null;
                return (
                  <div key={String(doc._id)} className="doc-card bg-white rounded-2xl p-6 transition-all" style={{ border: "1px solid #e2e8f0" }}>
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-4" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}>
                      {String(doc.name).charAt(0).toUpperCase()}
                    </div>

                    <h3 className="font-bold text-gray-900 text-base">Dr. {String(doc.name)}</h3>

                    {doc.specialization && (
                      <p className="text-sm font-medium mt-0.5" style={{ color: "#0284c7" }}>{String(doc.specialization)}</p>
                    )}

                    <div className="mt-3 space-y-1.5">
                      {doc.specialization && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                          <span>·</span>
                          <span>{String(doc.experience)} years experience</span>
                        </div>
                      )}
                      {doc.gender && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                          <span>·</span>
                          <span>{String(doc.gender)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}>Available</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
