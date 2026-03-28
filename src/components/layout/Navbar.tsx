"use client";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const portals = [
  { label: "Admin Portal", href: "/login?portal=Admin" },
  { label: "Doctor Portal", href: "/login?portal=Doctor" },
  { label: "Patient Portal", href: "/login?portal=Patient" },
  { label: "Staff Portal", href: "/login?portal=Reception" },
  { label: "Pharmacy Portal", href: "/login?portal=Pharmacy" },
  { label: "Lab Portal", href: "/login?portal=Lab" },
];

export default function Navbar({ active }: { active?: string }) {
  const [open, setOpen] = useState<null | "nav" | "login">(null);

  return (
    <>
      <style>{`
        .nav-link { color: #64748b; transition: all 0.2s; font-size: 14px; font-weight: 500; padding: 6px 12px; border-radius: 8px; border: 1px solid transparent; }
        .nav-link:hover { color: #0284c7; background-color: #f0f9ff; border-color: #bae6fd; }
      `}</style>

      <nav style={{ backgroundColor: "rgba(255,255,255,0.9)", borderBottom: "1px solid #e2e8f0", backdropFilter: "blur(12px)" }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black text-gray-900">MediCare</span>
            <span className="text-xs text-gray-400 hidden sm:inline">Hospital Management</span>
          </Link>

          {/* Nav links - desktop only */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link key={l.label} href={l.href} className="nav-link"
                style={active === l.label ? { color: "#0284c7", backgroundColor: "#f0f9ff", borderColor: "#bae6fd" } : {}}
              >{l.label}</Link>
            ))}
          </div>

          {/* Login button - desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => setOpen(open === "login" ? null : "login")}
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
              style={{ color: "#0284c7", border: "1px solid #bae6fd", backgroundColor: "#f0f9ff" }}
            >
              Login
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open === "login" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Mobile: hamburger + login side by side */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setOpen(open === "login" ? null : "login")}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg"
              style={{ color: "#0284c7", border: "1px solid #bae6fd", backgroundColor: open === "login" ? "#e0f2fe" : "#f0f9ff" }}
            >
              Login
              <svg className={`w-3 h-3 transition-transform duration-200 ${open === "login" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button onClick={() => setOpen(open === "nav" ? null : "nav")}
              className="flex flex-col gap-1.5 p-2 rounded-lg"
              style={{ border: "1px solid #e2e8f0", backgroundColor: open === "nav" ? "#f1f5f9" : "white" }}
            >
              <span className="w-5 h-0.5 bg-gray-600 block" />
              <span className="w-5 h-0.5 bg-gray-600 block" />
              <span className="w-5 h-0.5 bg-gray-600 block" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile: Nav slide-in */}
      {open === "nav" && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setOpen(null)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white flex flex-col" style={{ boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e2e8f0" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Navigation</p>
              <button onClick={() => setOpen(null)} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ border: "1px solid #e2e8f0" }}>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-4">
              {navLinks.map((l) => (
                <Link key={l.label} href={l.href} onClick={() => setOpen(null)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold mb-1"
                  style={active === l.label ? { color: "#0284c7", backgroundColor: "#f0f9ff" } : { color: "#0f172a" }}
                >{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile: Login portals slide-in */}
      {open === "login" && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setOpen(null)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white flex flex-col" style={{ boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e2e8f0" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Select Portal</p>
              <button onClick={() => setOpen(null)} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ border: "1px solid #e2e8f0" }}>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-4">
              {portals.map((p) => (
                <Link key={p.label} href={p.href} onClick={() => setOpen(null)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold mb-1"
                  style={{ color: "#0284c7" }}
                >{p.label} →</Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop portal dropdown */}
      {open === "login" && (
        <div className="fixed inset-0 z-50 hidden md:block" onClick={() => setOpen(null)}>
          <div className="absolute right-6 top-20 w-52 rounded-2xl py-2 bg-white" style={{ border: "1px solid #e2e8f0", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }} onClick={e => e.stopPropagation()}>
            <p className="text-[10px] font-bold px-4 py-2 uppercase tracking-widest text-gray-400">Select Portal</p>
            {portals.map((p) => (
              <Link key={p.label} href={p.href} onClick={() => setOpen(null)}
                className="flex items-center px-4 py-2.5 transition-all text-sm font-semibold rounded-lg mx-2"
                style={{ color: "#0f172a" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f9ff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
              >{p.label}</Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
