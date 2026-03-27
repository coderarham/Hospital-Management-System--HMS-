import Link from "next/link";

const labTests = [
  { name: "Complete Blood Count (CBC)", icon: "🩸", desc: "RBC, WBC, Platelets, Hemoglobin", price: "₹300", time: "4-6 hrs" },
  { name: "Blood Sugar (Fasting)", icon: "🍬", desc: "Glucose level in fasting state", price: "₹80", time: "2-4 hrs" },
  { name: "Blood Sugar (PP)", icon: "🍽️", desc: "Post-prandial glucose level", price: "₹80", time: "2-4 hrs" },
  { name: "HbA1c", icon: "📊", desc: "3-month average blood sugar", price: "₹400", time: "6-8 hrs" },
  { name: "Lipid Profile", icon: "💉", desc: "Cholesterol, Triglycerides, HDL, LDL", price: "₹500", time: "6-8 hrs" },
  { name: "Liver Function Test (LFT)", icon: "🫀", desc: "SGOT, SGPT, Bilirubin, Albumin", price: "₹600", time: "6-8 hrs" },
  { name: "Kidney Function Test (KFT)", icon: "🫘", desc: "Creatinine, Urea, Uric Acid", price: "₹500", time: "6-8 hrs" },
  { name: "Thyroid Profile (T3, T4, TSH)", icon: "🦋", desc: "Complete thyroid function", price: "₹700", time: "8-12 hrs" },
  { name: "Urine Routine & Microscopy", icon: "🧪", desc: "Physical, chemical & microscopic exam", price: "₹150", time: "2-4 hrs" },
  { name: "Dengue NS1 Antigen", icon: "🦟", desc: "Early dengue detection", price: "₹800", time: "4-6 hrs" },
  { name: "Malaria Antigen Test", icon: "🦠", desc: "Rapid malaria detection", price: "₹400", time: "2-3 hrs" },
  { name: "COVID-19 RT-PCR", icon: "😷", desc: "SARS-CoV-2 detection", price: "₹500", time: "12-24 hrs" },
  { name: "Vitamin D (25-OH)", icon: "☀️", desc: "Vitamin D deficiency check", price: "₹1200", time: "8-12 hrs" },
  { name: "Vitamin B12", icon: "💊", desc: "B12 deficiency check", price: "₹900", time: "8-12 hrs" },
  { name: "Iron Studies", icon: "⚙️", desc: "Serum Iron, TIBC, Ferritin", price: "₹800", time: "6-8 hrs" },
  { name: "ESR", icon: "🔬", desc: "Erythrocyte Sedimentation Rate", price: "₹100", time: "2-4 hrs" },
  { name: "CRP (C-Reactive Protein)", icon: "🧬", desc: "Infection & inflammation marker", price: "₹350", time: "4-6 hrs" },
  { name: "Blood Group & Rh Factor", icon: "🅰️", desc: "ABO & Rh blood typing", price: "₹100", time: "1-2 hrs" },
];

export default function LabTestsPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span className="text-lg font-bold tracking-tight">MediCare</span>
        </div>
        <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative border-b border-white/10 px-6 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.15)_0%,_transparent_70%)]" />
        <div className="relative">
          <span className="inline-block bg-red-600/10 border border-red-600/30 text-red-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            Diagnostic Laboratory
          </span>
          <h1 className="text-5xl font-black tracking-tight mb-4">
            Lab <span className="text-red-500">Tests</span>
          </h1>
          <p className="text-white/40 text-lg max-w-md mx-auto">
            Precision diagnostics with same-day results. Trusted by 50,000+ patients.
          </p>
          <div className="flex items-center justify-center gap-8 mt-10">
            {[
              { value: "18+", label: "Tests Available" },
              { value: "24/7", label: "Lab Open" },
              { value: "99.9%", label: "Accuracy" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-red-500">{s.value}</div>
                <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold tracking-tight">All Tests</h2>
          <span className="text-white/30 text-sm">{labTests.length} tests</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/10">
          {labTests.map((test, i) => (
            <div
              key={test.name}
              className="bg-black hover:bg-white/5 transition-colors p-6 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{test.icon}</span>
                <span className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                  {test.price}
                </span>
              </div>
              <h3 className="font-semibold text-white text-sm leading-snug mb-1.5 group-hover:text-red-400 transition-colors">
                {test.name}
              </h3>
              <p className="text-white/35 text-xs leading-relaxed">{test.desc}</p>
              <div className="flex items-center gap-1.5 mt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-xs text-white/30">Result in {test.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/10 px-6 py-12 text-center">
        <p className="text-white/30 text-sm mb-1">To book a test, visit reception or call</p>
        <p className="text-white font-bold text-lg tracking-wide">+91-1800-MEDICARE</p>
      </div>

    </div>
  );
}
