"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" style={{ backgroundColor: "#0f172a", color: "rgba(255,255,255,0.6)" }} className="px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-lg font-black text-white">MediCare</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">Providing world-class healthcare services since 2022. Your health is our highest priority.</p>
            <div className="flex gap-3">
              {[
                { key: "linkedin", label: "in", href: "https://linkedin.com" },
                { key: "twitter", label: "𝕏", href: "https://twitter.com" },
                { key: "gmail", label: "✉", href: "mailto:info@medicare.com" },
              ].map((s) => (
                <a key={s.key} href={s.href} target={s.key !== "gmail" ? "_blank" : undefined} rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(14,165,233,0.3)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Doctors", href: "/doctors" },
                { label: "Services", href: "/services" },
                { label: "About Us", href: "/#about" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-white">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>📞 +91-12345-67890</li>
              <li>🚑 Ambulance: 108</li>
              <li>✉️ info@medicare.com</li>
              <li className="leading-relaxed">1/A CIT Road,<br />Kolkata, West Bengal — 700014</li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-white">Working Hours</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex justify-between gap-4"><span>Mon – Fri</span><span className="text-white font-medium">8am – 8pm</span></li>
              <li className="flex justify-between gap-4"><span>Saturday</span><span className="text-white font-medium">9am – 6pm</span></li>
              <li className="flex justify-between gap-4"><span>Sunday</span><span className="text-white font-medium">10am – 4pm</span></li>
              <li className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-center" style={{ backgroundColor: "rgba(14,165,233,0.15)", color: "#38bdf8", border: "1px solid rgba(14,165,233,0.2)" }}>
                🟢 Emergency: 24/7
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-center sm:text-left" style={{ color: "rgba(255,255,255,0.25)" }}>
              © 2026 MediCare Hospital. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Developed by Arham</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {[
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Cookie Policy", href: "/privacy#cookies" },
                { label: "Disclaimer", href: "/terms#disclaimer" },
              ].map((l) => (
                <Link key={l.label} href={l.href} className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
