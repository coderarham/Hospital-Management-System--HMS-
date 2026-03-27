import Link from "next/link";
import LoginDropdown from "@/components/ui/LoginDropdown";
import Footer from "@/components/layout/Footer";

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing and using MediCare Hospital's website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.",
  },
  {
    title: "Medical Disclaimer",
    id: "disclaimer",
    content: "The information provided on this website is for general informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional for medical diagnosis and treatment. MediCare Hospital is not liable for any decisions made based on information found on this website.",
  },
  {
    title: "Use of Services",
    content: "Our services are intended for lawful purposes only. You agree not to misuse our portal, submit false information, or attempt to gain unauthorized access to any part of our system. Patient data and medical records are confidential and protected under applicable laws.",
  },
  {
    title: "Appointments & Cancellations",
    content: "Appointments booked through our portal are subject to doctor availability. Please cancel at least 24 hours in advance. Repeated no-shows may result in restricted booking privileges. Emergency cases are always prioritized regardless of scheduled appointments.",
  },
  {
    title: "Billing & Payments",
    content: "All charges are as per the hospital's standard fee schedule. Bills must be settled before discharge unless prior arrangements have been made. Insurance claims are subject to the terms of your insurance provider. MediCare is not responsible for claim rejections by third-party insurers.",
  },
  {
    title: "Intellectual Property",
    content: "All content on this website including text, graphics, logos, and software is the property of MediCare Hospital and is protected by applicable intellectual property laws. Unauthorized reproduction or distribution is strictly prohibited.",
  },
  {
    title: "Limitation of Liability",
    content: "MediCare Hospital shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our liability is limited to the extent permitted by applicable law.",
  },
  {
    title: "Changes to Terms",
    content: "We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of our services after changes constitutes acceptance of the new terms.",
  },
  {
    title: "Contact Us",
    content: "For any questions regarding these Terms & Conditions, please contact us at legal@medicare.com or call +91-1800-MEDICARE.",
  },
];

export default function TermsPage() {
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
          <h1 className="text-3xl font-black text-gray-900 mt-3">Terms & Conditions</h1>
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
