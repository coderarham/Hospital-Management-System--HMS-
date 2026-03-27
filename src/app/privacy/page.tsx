import Link from "next/link";
import LoginDropdown from "@/components/ui/LoginDropdown";
import Footer from "@/components/layout/Footer";

const sections = [
  {
    title: "Information We Collect",
    content: "We collect personal information including your name, contact details, date of birth, and medical history when you register or use our services. We also collect usage data such as IP address, browser type, and pages visited to improve our platform.",
  },
  {
    title: "How We Use Your Information",
    content: "Your information is used to provide and improve our healthcare services, schedule appointments, process billing, send appointment reminders, and comply with legal obligations. We do not sell your personal data to third parties.",
  },
  {
    title: "Medical Records & Confidentiality",
    content: "All medical records are treated with strict confidentiality in accordance with applicable healthcare privacy laws. Access to your records is restricted to authorized healthcare professionals involved in your care and yourself.",
  },
  {
    title: "Data Sharing",
    content: "We may share your information with treating doctors, specialists, and labs within our network as necessary for your care. We may also share data with insurance providers for billing purposes, or when required by law.",
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    content: "We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser. Disabling cookies may affect some features of our website.",
  },
  {
    title: "Data Security",
    content: "We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information. However, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "Your Rights",
    content: "You have the right to access, correct, or delete your personal data. You may also request a copy of your data or withdraw consent at any time. To exercise these rights, contact our Data Protection Officer at privacy@medicare.com.",
  },
  {
    title: "Retention of Data",
    content: "We retain your personal and medical data for as long as necessary to provide services and comply with legal requirements. Medical records are typically retained for a minimum of 7 years as required by law.",
  },
  {
    title: "Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our website. Continued use of our services after changes constitutes acceptance.",
  },
  {
    title: "Contact & Grievances",
    content: "For privacy-related concerns, contact our Data Protection Officer at privacy@medicare.com or write to us at 123 Hospital Road, Medical District, City — 400001. We aim to respond within 7 business days.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        body { background-color: #f8fafc; }
        .nav-link { color: #64748b; transition: all 0.2s; font-size: 14px; font-weight: 500; padding: 6px 12px; border-radius: 8px; border: 1px solid transparent; }
        .nav-link:hover { color: #0284c7; background-color: #f0f9ff; border-color: #bae6fd; }
      `}</style>
      <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>

        <nav style={{ backgroundColor: "rgba(255,255,255,0.9)", borderBottom: "1px solid #e2e8f0", backdropFilter: "blur(12px)" }} className="sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-lg font-black text-gray-900">MediCare</span>
              <span className="text-xs text-gray-400 hidden sm:inline">Hospital Management</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/doctors" className="nav-link">Doctors</Link>
              <Link href="/services" className="nav-link">Services</Link>
              <Link href="/#about" className="nav-link">About</Link>
              <Link href="/#contact" className="nav-link">Contact</Link>
            </div>
            <LoginDropdown />
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 pt-12 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#0284c7", backgroundColor: "#e0f2fe" }}>Legal</span>
          <h1 className="text-3xl font-black text-gray-900 mt-3">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: January 2025</p>
        </div>

        <div className="max-w-4xl mx-auto px-6 pb-16 space-y-4">
          {sections.map((s, i) => (
            <div key={s.title} id={s.id} className="bg-white rounded-2xl p-6" style={{ border: "1px solid #e2e8f0" }}>
              <div className="flex items-start gap-3">
                <span className="text-xs font-black px-2 py-1 rounded-lg flex-shrink-0 mt-0.5" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}>{i + 1}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </>
  );
}
