import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";

const NAV_ITEMS: Record<string, { label: string; href: string; icon: string }[]> = {
  Admin: [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Doctors", href: "/admin/doctors", icon: "👨⚕️" },
    { label: "Patients", href: "/admin/patients", icon: "🧑⚕️" },
    { label: "Staff Members", href: "/admin/staff", icon: "👥" },
    { label: "Departments", href: "/admin/departments", icon: "🏢" },
    { label: "Appointments", href: "/admin/appointments", icon: "📅" },
    { label: "Billing", href: "/admin/billing", icon: "💰" },
    { label: "Lab Reports", href: "/admin/lab-reports", icon: "🔬" },
    { label: "Reports", href: "/admin/reports", icon: "📈" },
    { label: "Settings", href: "/admin/settings", icon: "⚙️" },
  ],
  Doctor: [
    { label: "Dashboard", href: "/doctor", icon: "📊" },
    { label: "My Schedule", href: "/doctor/schedule", icon: "📅" },
    { label: "Patients", href: "/doctor/patients", icon: "🧑⚕️" },
    { label: "Prescriptions", href: "/doctor/prescriptions", icon: "💊" },
    { label: "Lab Reports", href: "/doctor/lab-reports", icon: "🔬" },
  ],
  Patient: [
    { label: "Dashboard", href: "/patient", icon: "📊" },
    { label: "Book Appointment", href: "/patient/appointments", icon: "📅" },
    { label: "My Records", href: "/patient/records", icon: "📋" },
    { label: "Prescriptions", href: "/patient/prescriptions", icon: "💊" },
    { label: "Lab Reports", href: "/patient/lab-reports", icon: "🔬" },
    { label: "Bills", href: "/patient/bills", icon: "💰" },
  ],
  Reception: [
    { label: "Dashboard", href: "/reception", icon: "📊" },
    { label: "Register Patient", href: "/reception/register", icon: "➕" },
    { label: "Appointments", href: "/reception/appointments", icon: "📅" },
    { label: "Bed Management", href: "/reception/beds", icon: "🛏️" },
    { label: "Billing", href: "/reception/billing", icon: "💰" },
  ],
  Pharmacy: [
    { label: "Dashboard", href: "/pharmacy", icon: "📊" },
    { label: "Prescriptions", href: "/pharmacy/prescriptions", icon: "📋" },
    { label: "Inventory", href: "/pharmacy/inventory", icon: "📦" },
    { label: "Low Stock Alerts", href: "/pharmacy/alerts", icon: "⚠️" },
  ],
  Lab: [
    { label: "Dashboard", href: "/lab", icon: "📊" },
    { label: "Test Requests", href: "/lab/requests", icon: "📋" },
    { label: "Upload Reports", href: "/lab/upload", icon: "📤" },
    { label: "Completed Tests", href: "/lab/completed", icon: "✅" },
  ],
  Security: [
    { label: "Dashboard", href: "/security", icon: "📊" },
    { label: "Visitor Log", href: "/security/visitors", icon: "📝" },
  ],
  Billing: [
    { label: "Dashboard", href: "/billing", icon: "📊" },
    { label: "Generate Bill", href: "/billing/generate", icon: "🧾" },
    { label: "Payment History", href: "/billing/history", icon: "💰" },
  ],
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = verifyToken(token || "") as { id: string; role: string; name: string } | null;

  if (!decoded) redirect("/login");

  const navItems = NAV_ITEMS[decoded.role] || [];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <Sidebar role={decoded.role} userName={decoded.name} navItems={navItems} />
      <main className="flex-1 overflow-auto min-w-0" style={{ backgroundColor: "#f8fafc" }}>
        <div className="p-4 md:p-8 pt-20 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
