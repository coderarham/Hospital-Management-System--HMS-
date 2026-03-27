import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import Bill from "@/models/Bill";
import StatCard from "@/components/ui/StatCard";
import Link from "next/link";

async function getReceptionStats() {
  await connectDB();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalPatients, todayAppts, pendingBills] = await Promise.all([
    User.countDocuments({ role: "Patient" }),
    Appointment.countDocuments({ appointmentDate: { $gte: today }, status: "Scheduled" }),
    Bill.countDocuments({ status: "Pending" }),
  ]);
  return { totalPatients, todayAppts, pendingBills };
}

export default async function ReceptionDashboard() {
  const stats = await getReceptionStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reception Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Front desk operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Patients" value={stats.totalPatients} icon="🧑⚕️" color="bg-green-50 text-green-600" />
        <StatCard title="Today's Appointments" value={stats.todayAppts} icon="📅" color="bg-sky-50 text-sky-600" />
        <StatCard title="Pending Bills" value={stats.pendingBills} icon="💰" color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Register Patient", desc: "Add new walk-in patient", href: "/reception/register", icon: "➕", color: "text-green-600" },
          { title: "Appointments", desc: "View today's schedule", href: "/reception/appointments", icon: "📅", color: "text-sky-600" },
          { title: "Generate Bill", desc: "Create patient invoice", href: "/reception/billing", icon: "💰", color: "text-orange-600" },
          { title: "Bed Management", desc: "Check bed availability", href: "/reception/beds", icon: "🛏️", color: "text-purple-600" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="card hover:shadow-md transition-shadow group">
            <div className={`text-3xl mb-3 ${item.color}`}>{item.icon}</div>
            <h3 className="font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">{item.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
