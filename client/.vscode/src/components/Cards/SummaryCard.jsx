import { TrendingUp } from "lucide-react";

function SummaryCard({ title, amount, icon: Icon, trend, trendColor }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition duration-300 p-6">

      <div className="flex justify-between items-center">

        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {title}
        </p>

        <Icon className="text-blue-600" size={22} />

      </div>

      <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-6">
        {amount}
      </h2>

      <p className={`mt-4 text-sm font-semibold ${trendColor}`}>
        {trend}
      </p>

    </div>
  );
}

export default SummaryCard;