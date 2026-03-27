import { connectDB } from "@/lib/mongodb";
import Medicine from "@/models/Medicine";
import Prescription from "@/models/Prescription";
import StatCard from "@/components/ui/StatCard";
import Link from "next/link";

async function getPharmacyStats() {
  await connectDB();
  const [totalMedicines, lowStock, pendingPrescriptions] = await Promise.all([
    Medicine.countDocuments({}),
    Medicine.countDocuments({ $expr: { $lte: ["$stock", "$lowStockThreshold"] } }),
    Prescription.countDocuments({ dispensed: false }),
  ]);
  return { totalMedicines, lowStock, pendingPrescriptions };
}

export default async function PharmacyDashboard() {
  const stats = await getPharmacyStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Medicine inventory & prescription management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Medicines" value={stats.totalMedicines} icon="💊" color="bg-orange-50 text-orange-600" />
        <StatCard title="Low Stock Alerts" value={stats.lowStock} icon="⚠️" color="bg-red-50 text-red-600" subtitle="Need restock" />
        <StatCard title="Pending Prescriptions" value={stats.pendingPrescriptions} icon="📋" color="bg-sky-50 text-sky-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Pending Prescriptions", desc: "Dispense medicines to patients", href: "/pharmacy/prescriptions", icon: "📋", color: "text-sky-600" },
          { title: "Medicine Inventory", desc: "View and manage stock", href: "/pharmacy/inventory", icon: "📦", color: "text-orange-600" },
          { title: "Low Stock Alerts", desc: "Medicines needing restock", href: "/pharmacy/alerts", icon: "⚠️", color: "text-red-600" },
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
