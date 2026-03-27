import { connectDB } from "@/lib/mongodb";
import LabReport from "@/models/LabReport";
import StatCard from "@/components/ui/StatCard";
import Link from "next/link";

async function getLabStats() {
  await connectDB();
  const [pending, processing, completed] = await Promise.all([
    LabReport.countDocuments({ status: "Pending" }),
    LabReport.countDocuments({ status: "Processing" }),
    LabReport.countDocuments({ status: "Completed" }),
  ]);
  return { pending, processing, completed };
}

export default async function LabDashboard() {
  const stats = await getLabStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lab & Diagnostics</h1>
        <p className="text-gray-500 text-sm mt-1">Manage test requests and reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Pending Tests" value={stats.pending} icon="⏳" color="bg-orange-50 text-orange-600" />
        <StatCard title="Processing" value={stats.processing} icon="🔄" color="bg-sky-50 text-sky-600" />
        <StatCard title="Completed Today" value={stats.completed} icon="✅" color="bg-green-50 text-green-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Test Requests", desc: "View incoming test orders", href: "/lab/requests", icon: "📋", color: "text-orange-600" },
          { title: "Upload Reports", desc: "Upload completed test results", href: "/lab/upload", icon: "📤", color: "text-sky-600" },
          { title: "Completed Tests", desc: "View all completed reports", href: "/lab/completed", icon: "✅", color: "text-green-600" },
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
