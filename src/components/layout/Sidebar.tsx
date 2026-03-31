"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  role: string;
  userName: string;
  navItems: { label: string; href: string; icon: string }[];
}

export default function Sidebar({ role, userName, navItems }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const sidebarContent = (
    <aside className="w-64 min-h-screen flex flex-col h-full" style={{ backgroundColor: "#ffffff", borderRight: "1px solid #e2e8f0" }}>
      <div className="p-6" style={{ borderBottom: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between mb-5">
          <span className="text-base font-black text-gray-900">MediCare</span>
          <button onClick={() => setOpen(false)} className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg" style={{ border: "1px solid #e2e8f0" }}>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold truncate max-w-[140px] text-gray-900">{userName}</p>
            <p className="text-xs text-gray-400">{role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="sidebar-link" onClick={() => setOpen(false)}
            style={pathname === item.href ? { backgroundColor: "#e0f2fe", color: "#0284c7", fontWeight: 600 } : {}}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4" style={{ borderTop: "1px solid #e2e8f0" }}>
        <button onClick={handleLogout} className="sidebar-link w-full">
          <span className="text-base">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <span className="text-base font-black text-gray-900">MediCare</span>
        <button onClick={() => setOpen(true)} className="flex flex-col gap-1.5 p-2 rounded-lg" style={{ border: "1px solid #e2e8f0" }}>
          <span className="w-5 h-0.5 bg-gray-600 block" />
          <span className="w-5 h-0.5 bg-gray-600 block" />
          <span className="w-5 h-0.5 bg-gray-600 block" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex">{sidebarContent}</div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} />
          <div className="absolute left-0 top-0 h-full" onClick={e => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
