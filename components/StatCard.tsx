export interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: "blue" | "green" | "red" | "purple" | "orange";
  trend?: { value: number; positive: boolean };
}

const colorClasses = {
  blue: "from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-900",
  green:
    "from-green-500/10 to-green-500/5 border-green-200 dark:border-green-900",
  red: "from-red-500/10 to-red-500/5 border-red-200 dark:border-red-900",
  purple:
    "from-purple-500/10 to-purple-500/5 border-purple-200 dark:border-purple-900",
  orange:
    "from-orange-500/10 to-orange-500/5 border-orange-200 dark:border-orange-900",
};

export default function StatCard({
  label,
  value,
  icon,
  color,
  trend,
}: StatCardProps) {
  return (
    <div
      className={`rounded-lg border bg-gradient-to-br ${colorClasses[color]} p-4 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
            {value.toLocaleString("en-IN")}
          </p>
          {trend && (
            <p
              className={`mt-1 text-xs font-medium ${
                trend.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
