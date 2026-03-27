import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import StatCard from "@/components/ui/StatCard";
import Link from "next/link";

async function getDoctorStats(doctorId: string) {
  await connectDB();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayAppts, totalPatients, pendingAppts] = await Promise.all([
    Appointment.countDocuments({ doctorId, appointmentDate: { $gte: today }, status: "Scheduled" }),
    Appointment.distinct("patientId", { doctorId }),
    Appointment.countDocuments({ doctorId, status: "Scheduled" }),
  ]);

  const upcoming = await Appointment.find({ doctorId, status: "Scheduled", appointmentDate: { $gte: today } })
    .populate("patientId", "name email phone")
    .sort({ appointmentDate: 1 })
    .limit(5)
    .lean();

  return { todayAppts, totalPatients: totalPatients.length, pendingAppts, upcoming };
}

export default async function DoctorDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = verifyToken(token || "") as { id: string; name: string } | null;
  if (!decoded) return null;

  const stats = await getDoctorStats(decoded.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {decoded.name}</h1>
        <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Today's Appointments" value={stats.todayAppts} icon="📅" color="bg-sky-50 text-sky-600" />
        <StatCard title="Total Patients" value={stats.totalPatients} icon="🧑⚕️" color="bg-green-50 text-green-600" />
        <StatCard title="Pending Appointments" value={stats.pendingAppts} icon="⏳" color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Today&apos;s Schedule</h2>
            <Link href="/doctor/schedule" className="text-sm text-sky-600 hover:underline">View all</Link>
          </div>
          {stats.upcoming.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No appointments today</p>
          ) : (
            <div className="space-y-3">
              {stats.upcoming.map((appt: Record<string, unknown>) => {
                const patient = appt.patientId as { name: string; phone?: string } | null;
                return (
                  <div key={String(appt._id)} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {String(appt.tokenNumber || "?")}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{patient?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(String(appt.appointmentDate)).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className="badge bg-sky-100 text-sky-700">Scheduled</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Write Prescription", href: "/doctor/prescriptions", icon: "💊", color: "bg-blue-50 text-blue-600" },
              { label: "View Lab Reports", href: "/doctor/lab-reports", icon: "🔬", color: "bg-red-50 text-red-600" },
              { label: "My Patients", href: "/doctor/patients", icon: "🧑⚕️", color: "bg-green-50 text-green-600" },
              { label: "My Schedule", href: "/doctor/schedule", icon: "📅", color: "bg-sky-50 text-sky-600" },
            ].map((action) => (
              <Link key={action.href} href={action.href} className={`p-4 rounded-xl ${action.color} hover:opacity-80 transition-opacity`}>
                <div className="text-2xl mb-1">{action.icon}</div>
                <p className="text-sm font-medium">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
