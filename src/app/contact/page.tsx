"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const emergencyNumbers = [
  { icon: "🚑", label: "Ambulance", number: "108", sub: "Free 24/7 Emergency", color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
  { icon: "🏥", label: "Emergency Ward", number: "+91-1800-108-108", sub: "24/7 Critical Care", color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
  { icon: "❤️", label: "Cardiac Helpline", number: "+91-1800-200-200", sub: "Heart Emergency", color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
];

const helplines = [
  { icon: "📞", label: "General Enquiry", number: "+91-12345-67890", time: "Mon–Sat, 8am–8pm" },
  { icon: "👨⚕️", label: "Doctor Appointment", number: "+91-12345-11111", time: "Mon–Sat, 9am–6pm" },
  { icon: "🔬", label: "Lab & Reports", number: "+91-12345-22222", time: "Mon–Sat, 7am–9pm" },
  { icon: "💊", label: "Pharmacy", number: "+91-12345-33333", time: "24/7 Available" },
  { icon: "🧾", label: "Billing & Insurance", number: "+91-12345-44444", time: "Mon–Fri, 9am–5pm" },
  { icon: "✉️", label: "Email Us", number: "info@medicare.com", time: "Reply within 24 hrs" },
];

export default function ContactPage() {
  const [feedbackForm, setFeedbackForm] = useState({ name: "", email: "", phone: "", rating: "", message: "" });
  const [complaintForm, setComplaintForm] = useState({ name: "", email: "", phone: "", date: "", against: "", description: "" });
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [complaintSent, setComplaintSent] = useState(false);
  const [activeTab, setActiveTab] = useState<"feedback" | "complaint">("feedback");

  function handleFeedback(e: React.FormEvent) {
    e.preventDefault();
    setFeedbackSent(true);
    setFeedbackForm({ name: "", email: "", phone: "", rating: "", message: "" });
    setTimeout(() => setFeedbackSent(false), 4000);
  }

  function handleComplaint(e: React.FormEvent) {
    e.preventDefault();
    setComplaintSent(true);
    setComplaintForm({ name: "", email: "", phone: "", date: "", against: "", description: "" });
    setTimeout(() => setComplaintSent(false), 4000);
  }

  const inputStyle = { border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 13, width: "100%", outline: "none", backgroundColor: "#f8fafc", color: "#0f172a" };
  const labelStyle = { fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 5, display: "block" };

  return (
    <>
      <style>{`body { background-color: #f8fafc; } input:focus, textarea:focus, select:focus { border-color: #0284c7 !important; background-color: #fff !important; }`}</style>
      <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <Navbar active="Contact" />

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)" }} className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #0ea5e9 0%, transparent 50%)" }} />
          <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)", color: "#38bdf8" }}>Contact Us</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">We're Here to <span style={{ color: "#38bdf8" }}>Help You</span></h1>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>Reach out for appointments, emergencies, feedback, or any queries. Our team is available 24/7.</p>
          </div>
        </section>

        {/* Emergency Numbers */}
        <section className="px-6 py-12" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#dc2626", backgroundColor: "#fee2e2" }}>🚨 Emergency</span>
              <h2 className="text-2xl font-black mt-3 text-gray-900">Emergency Numbers</h2>
              <p className="text-xs text-gray-500 mt-1">Call immediately in case of any medical emergency</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {emergencyNumbers.map((e) => (
                <a key={e.label} href={`tel:${e.number.replace(/\D/g, "")}`}
                  className="rounded-2xl p-6 text-center hover:shadow-lg transition-all block"
                  style={{ border: `2px solid ${e.border}`, backgroundColor: e.bg }}>
                  <div className="text-4xl mb-3">{e.icon}</div>
                  <div className="font-black text-gray-900 mb-1">{e.label}</div>
                  <div className="text-xl font-black mb-1" style={{ color: e.color }}>{e.number}</div>
                  <div className="text-xs font-medium text-gray-500">{e.sub}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Helpline Numbers */}
        <section className="px-6 py-12" style={{ backgroundColor: "#f8fafc" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#0284c7", backgroundColor: "#e0f2fe" }}>Helplines</span>
              <h2 className="text-2xl font-black mt-3 text-gray-900">Department Helplines</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {helplines.map((h) => (
                <div key={h.label} className="bg-white rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all" style={{ border: "1px solid #e2e8f0" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: "#e0f2fe" }}>{h.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm">{h.label}</div>
                    <div className="font-black text-sm truncate" style={{ color: "#0284c7" }}>{h.number}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{h.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visit Us */}
        <section className="px-6 py-12" style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-5">
            <div className="rounded-2xl p-6" style={{ border: "1px solid #e2e8f0" }}>
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-black text-gray-900 mb-2">Our Address</h3>
              <p className="text-sm text-gray-500 leading-relaxed">1/A CIT Road, Scheme VI M,<br />Kankurgachi, Kolkata,<br />West Bengal — 700054</p>
            </div>
            <div className="rounded-2xl p-6" style={{ border: "1px solid #e2e8f0" }}>
              <div className="text-3xl mb-3">🕐</div>
              <h3 className="font-black text-gray-900 mb-2">Working Hours</h3>
              <div className="space-y-1.5 text-sm text-gray-500">
                <div className="flex justify-between"><span>Mon – Fri</span><span className="font-bold text-gray-800">8am – 8pm</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="font-bold text-gray-800">9am – 6pm</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="font-bold text-gray-800">10am – 4pm</span></div>
                <div className="mt-2 text-xs px-3 py-1.5 rounded-lg text-center font-semibold" style={{ backgroundColor: "#d1fae5", color: "#059669" }}>🟢 Emergency: 24/7</div>
              </div>
            </div>

          </div>
        </section>

        {/* Feedback & Complaint Forms */}
        <section className="px-6 py-14" style={{ backgroundColor: "#f8fafc" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#0284c7", backgroundColor: "#e0f2fe" }}>Your Voice Matters</span>
              <h2 className="text-2xl font-black mt-3 text-gray-900">Feedback & Complaints</h2>
              <p className="text-xs text-gray-500 mt-1">Help us improve by sharing your experience</p>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl p-1 mb-6" style={{ backgroundColor: "#e2e8f0" }}>
              <button onClick={() => setActiveTab("feedback")} className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                style={activeTab === "feedback" ? { backgroundColor: "#fff", color: "#0284c7", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" } : { color: "#64748b" }}>
                Feedback
              </button>
              <button onClick={() => setActiveTab("complaint")} className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                style={activeTab === "complaint" ? { backgroundColor: "#fff", color: "#dc2626", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" } : { color: "#64748b" }}>
                Complaint
              </button>
            </div>

            {/* Feedback Form */}
            {activeTab === "feedback" && (
              <div className="bg-white rounded-2xl p-6 md:p-8" style={{ border: "1px solid #e2e8f0" }}>
                <h3 className="font-black text-gray-900 mb-1">Share Your Experience</h3>
                <p className="text-xs text-gray-400 mb-6">Your feedback helps us serve you better</p>

                {feedbackSent && (
                  <div className="mb-5 px-4 py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: "#d1fae5", color: "#059669", border: "1px solid #6ee7b7" }}>
                    ✅ Thank you! Your feedback has been submitted successfully.
                  </div>
                )}

                <form onSubmit={handleFeedback} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input required style={inputStyle} placeholder="Your name" value={feedbackForm.name} onChange={e => setFeedbackForm({ ...feedbackForm, name: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input type="email" style={inputStyle} placeholder="your@email.com" value={feedbackForm.email} onChange={e => setFeedbackForm({ ...feedbackForm, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                      <label style={labelStyle}>Phone</label>
                      <input style={inputStyle} placeholder="+91-XXXXX-XXXXX" value={feedbackForm.phone} onChange={e => setFeedbackForm({ ...feedbackForm, phone: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Overall Rating *</label>
                    <select required style={inputStyle} value={feedbackForm.rating} onChange={e => setFeedbackForm({ ...feedbackForm, rating: e.target.value })}>
                      <option value="">Select rating</option>
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Good</option>
                      <option value="3">⭐⭐⭐ Average</option>
                      <option value="2">⭐⭐ Poor</option>
                      <option value="1">⭐ Very Poor</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Your Feedback *</label>
                    <textarea required rows={4} style={{ ...inputStyle, resize: "none" }} placeholder="Tell us about your experience..." value={feedbackForm.message} onChange={e => setFeedbackForm({ ...feedbackForm, message: e.target.value })} />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl text-sm font-black text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)", boxShadow: "0 4px 16px rgba(14,165,233,0.3)" }}>
                    Submit Feedback →
                  </button>
                </form>
              </div>
            )}

            {/* Complaint Form */}
            {activeTab === "complaint" && (
              <div className="bg-white rounded-2xl p-6 md:p-8" style={{ border: "1px solid #fca5a5" }}>
                <h3 className="font-black text-gray-900 mb-1">File a Complaint</h3>
                <p className="text-xs text-gray-400 mb-6">All complaints are reviewed within 48 hours and kept confidential</p>

                {complaintSent && (
                  <div className="mb-5 px-4 py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: "#d1fae5", color: "#059669", border: "1px solid #6ee7b7" }}>
                    ✅ Your complaint has been registered. We will contact you within 48 hours.
                  </div>
                )}

                <form onSubmit={handleComplaint} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input required style={inputStyle} placeholder="Your name" value={complaintForm.name} onChange={e => setComplaintForm({ ...complaintForm, name: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input required type="email" style={inputStyle} placeholder="your@email.com" value={complaintForm.email} onChange={e => setComplaintForm({ ...complaintForm, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Phone *</label>
                      <input required style={inputStyle} placeholder="+91-XXXXX-XXXXX" value={complaintForm.phone} onChange={e => setComplaintForm({ ...complaintForm, phone: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Incident Date *</label>
                      <input required type="date" style={inputStyle} value={complaintForm.date} onChange={e => setComplaintForm({ ...complaintForm, date: e.target.value })} />
                    </div>
                  </div>
                  <div>
                      <label style={labelStyle}>Complaint Against</label>
                      <select style={inputStyle} value={complaintForm.against} onChange={e => setComplaintForm({ ...complaintForm, against: e.target.value })}>
                        <option value="">Select</option>
                        {["Doctor", "Nurse", "Staff", "Billing", "Facility", "Other"].map(a => <option key={a}>{a}</option>)}
                      </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Complaint Description *</label>
                    <textarea required rows={5} style={{ ...inputStyle, resize: "none" }} placeholder="Please describe your complaint in detail..." value={complaintForm.description} onChange={e => setComplaintForm({ ...complaintForm, description: e.target.value })} />
                  </div>
                  <div className="px-4 py-3 rounded-xl text-xs" style={{ backgroundColor: "#fef3c7", border: "1px solid #fcd34d", color: "#92400e" }}>
                     Your complaint is completely confidential and will be reviewed by our grievance committee within 48 hours.
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl text-sm font-black text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", boxShadow: "0 4px 16px rgba(220,38,38,0.3)" }}>
                    Submit Complaint →
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
