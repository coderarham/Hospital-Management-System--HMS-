import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import Bill from "@/models/Bill";
import StatCard from "@/components/ui/StatCard";
import Link from "next/link";

async function getStats() {
  await connectDB();
  const [totalDoctors, totalPatients, totalStaff, todayAppointments, pendingBills] = await Promise.all([
    User.countDocuments({ role: "Doctor", isActive: true }),
    User.countDocuments({ role: "Patient", isActive: true }),
    User.countDocuments({ role: { $nin: ["Patient", "Admin", "Doctor"] }, isActive: true }),
    Appointment.countDocuments({
      appointmentDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      status: "Scheduled",
    }),
    Bill.countDocuments({ status: "Pending" }),
  ]);
  return { totalDoctors, totalPatients, totalStaff, todayAppointments, pendingBills };
}

const sectionCards = {
  doctor: [
    { title: "All Doctors", desc: "View and manage all doctors", href: "/admin/doctors" },
    { title: "Departments", desc: "Manage hospital departments", href: "/admin/departments" },
    { title: "Appointments", desc: "View all hospital appointments", href: "/admin/appointments" },
  ],
  patient: [
    { title: "All Patients", desc: "View and manage all patients", href: "/admin/patients" },
    { title: "Billing", desc: "Track payments and invoices", href: "/admin/billing" },
    { title: "Lab Reports", desc: "View all lab reports", href: "/admin/lab-reports" },
  ],
  staff: [
    { title: "Staff Members", desc: "Add, edit or deactivate staff", href: "/admin/staff" },
    { title: "Reports", desc: "Analytics and hospital reports", href: "/admin/reports" },
    { title: "Settings", desc: "System configuration", href: "/admin/settings" },
  ],
};

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Hospital overview & management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Doctors" value={stats.totalDoctors} icon="👨⚕️" color="bg-blue-50 text-blue-600" />
        <StatCard title="Total Patients" value={stats.totalPatients} icon="🧑⚕️" color="bg-green-50 text-green-600" />
        <StatCard title="Today's Appointments" value={stats.todayAppointments} icon="📅" color="bg-sky-50 text-sky-600" />
        <StatCard title="Pending Bills" value={stats.pendingBills} icon="💰" color="bg-orange-50 text-orange-600" />
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionCards.doctor.map((item) => (
            <Link key={item.href} href={item.href} className="card hover:shadow-md transition-shadow group">
              <h3 className="font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionCards.patient.map((item) => (
            <Link key={item.href} href={item.href} className="card hover:shadow-md transition-shadow group">
              <h3 className="font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionCards.staff.map((item) => (
            <Link key={item.href} href={item.href} className="card hover:shadow-md transition-shadow group">
              <h3 className="font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
