"use client";
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

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ backgroundColor: "#ffffff", borderRight: "1px solid #e2e8f0" }}>
      <div className="p-6" style={{ borderBottom: "1px solid #e2e8f0" }}>
        <div className="flex items-center gap-2.5 mb-5">
          <span className="text-base font-black text-gray-900">MediCare</span>
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

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="sidebar-link"
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
}
