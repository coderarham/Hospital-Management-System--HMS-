interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  color?: string;
}

export default function StatCard({ title, value, icon, subtitle }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl p-5" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{title}</p>
        <p className="text-2xl font-black text-white">{value}</p>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{subtitle}</p>}
      </div>
    </div>
  );
}
