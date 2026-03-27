import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Bill from "@/models/Bill";
import StatCard from "@/components/ui/StatCard";
import Link from "next/link";

async function getPatientStats(patientId: string) {
  await connectDB();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [upcomingCount, pendingBills, totalVisits] = await Promise.all([
    Appointment.countDocuments({ patientId, status: "Scheduled", appointmentDate: { $gte: today } }),
    Bill.countDocuments({ patientId, status: { $in: ["Pending", "Partial"] } }),
    Appointment.countDocuments({ patientId, status: "Completed" }),
  ]);

  const upcoming = await Appointment.find({ patientId, status: "Scheduled", appointmentDate: { $gte: today } })
    .populate("doctorId", "name")
    .populate("departmentId", "name")
    .sort({ appointmentDate: 1 })
    .limit(3)
    .lean();

  return { upcomingCount, pendingBills, totalVisits, upcoming };
}

export default async function PatientDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = verifyToken(token || "") as { id: string; name: string } | null;
  if (!decoded) return null;

  const stats = await getPatientStats(decoded.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hello, {decoded.name} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Your health dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Upcoming Appointments" value={stats.upcomingCount} icon="📅" color="bg-sky-50 text-sky-600" />
        <StatCard title="Total Visits" value={stats.totalVisits} icon="🏥" color="bg-green-50 text-green-600" />
        <StatCard title="Pending Bills" value={stats.pendingBills} icon="💰" color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Upcoming Appointments</h2>
            <Link href="/patient/appointments" className="text-sm text-sky-600 hover:underline">Book New</Link>
          </div>
          {stats.upcoming.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm mb-3">No upcoming appointments</p>
              <Link href="/patient/appointments" className="btn-primary text-sm">Book Appointment</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.upcoming.map((appt: Record<string, unknown>) => {
                const doctor = appt.doctorId as { name: string } | null;
                const dept = appt.departmentId as { name: string } | null;
                return (
                  <div key={String(appt._id)} className="p-3 bg-sky-50 rounded-lg border border-sky-100">
                    <p className="text-sm font-medium text-gray-800">Dr. {doctor?.name}</p>
                    <p className="text-xs text-gray-500">{dept?.name}</p>
                    <p className="text-xs text-sky-600 mt-1 font-medium">
                      {new Date(String(appt.appointmentDate)).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">My Health Records</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Prescriptions", href: "/patient/prescriptions", icon: "💊", color: "bg-blue-50 text-blue-600" },
              { label: "Lab Reports", href: "/patient/lab-reports", icon: "🔬", color: "bg-red-50 text-red-600" },
              { label: "Medical Records", href: "/patient/records", icon: "📋", color: "bg-purple-50 text-purple-600" },
              { label: "My Bills", href: "/patient/bills", icon: "💰", color: "bg-green-50 text-green-600" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`p-4 rounded-xl ${item.color} hover:opacity-80 transition-opacity`}>
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-sm font-medium">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
