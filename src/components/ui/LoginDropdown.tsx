"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const portals = [
  { role: "Admin Portal", href: "/login?portal=Admin" },
  { role: "Doctor Portal", href: "/login?portal=Doctor" },
  { role: "Patient Portal", href: "/login?portal=Patient" },
  { role: "Staff Portal", href: "/login?portal=Reception" },
  { role: "Pharmacy Portal", href: "/login?portal=Pharmacy" },
  { role: "Lab Portal", href: "/login?portal=Lab" },
];

export default function LoginDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
        style={{ color: "#0284c7", border: "1px solid #bae6fd", backgroundColor: "#f0f9ff" }}
      >
        Login
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl py-2 z-50 bg-white" style={{ border: "1px solid #e2e8f0", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
          <p className="text-[10px] font-bold px-4 py-2 uppercase tracking-widest text-gray-400">Select Portal</p>
          {portals.map((p) => (
            <Link key={p.role} href={p.href} onClick={() => setOpen(false)}
              className="flex items-center px-4 py-2.5 transition-all text-sm font-semibold rounded-lg mx-2"
              style={{ color: "#0f172a" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f9ff"; (e.currentTarget as HTMLElement).style.outline = "1px solid #bae6fd"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ""; (e.currentTarget as HTMLElement).style.outline = ""; }}
            >
              {p.role}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
