import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const stats = [
  { value: "25+", label: "Years of Excellence", icon: "🏆" },
  { value: "500+", label: "Expert Doctors", icon: "👨‍⚕️" },
  { value: "50K+", label: "Patients Treated", icon: "❤️" },
  { value: "30+", label: "Departments", icon: "🏥" },
  { value: "99%", label: "Patient Satisfaction", icon: "⭐" },
  { value: "24/7", label: "Emergency Care", icon: "🚑" },
];

const goals = [
  { icon: "🎯", title: "Universal Healthcare Access", desc: "Make quality healthcare accessible and affordable for every individual, regardless of economic background.", color: "#0284c7" },
  { icon: "🤖", title: "Technology-Driven Care", desc: "Integrate cutting-edge AI, robotics, and telemedicine to deliver faster, more accurate diagnoses.", color: "#7c3aed" },
  { icon: "🌱", title: "Preventive Medicine", desc: "Shift focus from treatment to prevention through awareness programs, screenings, and wellness initiatives.", color: "#059669" },
  { icon: "🎓", title: "Medical Education Hub", desc: "Become a leading center for medical training, research, and innovation to shape the next generation of doctors.", color: "#d97706" },
  { icon: "♻️", title: "Sustainable Healthcare", desc: "Build an eco-friendly hospital infrastructure with zero-waste practices and green energy solutions.", color: "#0891b2" },
  { icon: "🤝", title: "Community Partnerships", desc: "Collaborate with NGOs, government bodies, and global health organizations to improve public health outcomes.", color: "#dc2626" },
];

const values = [
  { icon: "💙", title: "Compassion", desc: "We treat every patient with empathy, dignity, and respect." },
  { icon: "✅", title: "Integrity", desc: "Transparent, honest, and ethical in every decision we make." },
  { icon: "🔬", title: "Excellence", desc: "Committed to the highest standards of medical care and research." },
  { icon: "🤝", title: "Teamwork", desc: "Doctors, nurses, and staff working together for your well-being." },
];

export default function AboutPage() {
  return (
    <>
      <style>{`body { background-color: #f8fafc; }`}</style>
      <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <Navbar active="About" />

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)" }} className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 40%)" }} />
          <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)", color: "#38bdf8" }}>About Us</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              25 Years of Trusted <span style={{ color: "#38bdf8" }}>Medical Excellence</span>
            </h1>
            <p className="text-base max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
              Since 2000, MediCare Hospital has been at the forefront of healthcare innovation, delivering compassionate, world-class medical services to thousands of patients across India.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 py-14" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-5 rounded-2xl" style={{ border: "1px solid #e2e8f0" }}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-black text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="px-6 py-16" style={{ backgroundColor: "#f8fafc" }}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-8" style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5" style={{ backgroundColor: "rgba(14,165,233,0.15)" }}>🎯</div>
              <h2 className="text-xl font-black text-white mb-3">Our Mission</h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                To deliver compassionate, affordable, and high-quality medical care to every patient. We are committed to combining advanced technology with human touch to ensure the best possible health outcomes for our community.
              </p>
            </div>
            <div className="rounded-2xl p-8" style={{ background: "linear-gradient(135deg, #0c4a6e, #075985)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5" style={{ backgroundColor: "rgba(56,189,248,0.15)" }}>🔭</div>
              <h2 className="text-xl font-black text-white mb-3">Our Vision</h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                To be India's most trusted and innovative multi-specialty hospital — a beacon of hope where every patient receives world-class care, every doctor thrives, and every community is healthier.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="px-6 py-16" style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#0284c7", backgroundColor: "#e0f2fe" }}>What We Stand For</span>
              <h2 className="text-3xl font-black mt-3 text-gray-900">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v) => (
                <div key={v.title} className="bg-white rounded-2xl p-6 text-center" style={{ border: "1px solid #e2e8f0" }}>
                  <div className="text-4xl mb-3">{v.icon}</div>
                  <h3 className="font-black text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Goals */}
        <section className="px-6 py-16" style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#0284c7", backgroundColor: "#e0f2fe" }}>Looking Ahead</span>
              <h2 className="text-3xl font-black mt-3 text-gray-900">Our Goals</h2>
              <p className="text-sm mt-2 text-gray-500">Building the future of healthcare, one step at a time</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {goals.map((g) => (
                <div key={g.title} className="rounded-2xl p-6 hover:shadow-md transition-all" style={{ border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4" style={{ backgroundColor: `${g.color}18` }}>{g.icon}</div>
                  <h3 className="font-black text-gray-900 mb-2">{g.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{g.desc}</p>
                  <div className="mt-4 w-8 h-1 rounded-full" style={{ backgroundColor: g.color }} />
                </div>
              ))}
            </div>
          </div>
        </section>



        <Footer />
      </div>
    </>
  );
}
