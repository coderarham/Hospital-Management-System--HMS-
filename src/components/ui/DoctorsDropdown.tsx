"use client";
import { useState, useRef, useEffect } from "react";

interface Doctor {
  _id: string;
  name: string;
  specialization?: string;
  experience?: number;
  departmentId?: { name: string };
}

export default function DoctorsDropdown() {
  const [open, setOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleOpen() {
    setOpen(!open);
    if (!open && doctors.length === 0) {
      setLoading(true);
      const res = await fetch("/api/doctors");
      const data = await res.json();
      setDoctors(data);
      setLoading(false);
    }
  }

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all nav-link"
        style={open ? { color: "#0284c7", backgroundColor: "#f0f9ff", border: "1px solid #bae6fd" } : { border: "1px solid transparent" }}
      >
        Doctors
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-72 rounded-2xl py-3 z-50 bg-white" style={{ border: "1px solid #e2e8f0", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
          <p className="text-[10px] font-bold px-4 py-1 uppercase tracking-widest text-gray-400">Our Doctors</p>
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
          ) : doctors.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No doctors found</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {doctors.map((d) => (
                <div key={d._id} className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all cursor-default"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f9ff"; (e.currentTarget as HTMLElement).style.outline = "1px solid #bae6fd"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ""; (e.currentTarget as HTMLElement).style.outline = ""; }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}>
                    {d.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">Dr. {d.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {d.specialization || d.departmentId?.name || "General"}
                      {d.experience ? ` · ${d.experience} yrs exp` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
