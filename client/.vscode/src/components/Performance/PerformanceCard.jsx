function PerformanceCard({
  title,
  value,
  subtitle,
  color,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 hover:shadow-lg transition">

      <p className="text-slate-500 dark:text-slate-400 text-sm">
        {title}
      </p>

      <h2 className={`text-3xl font-bold mt-3 ${color}`}>
        {value}
      </h2>

      <p className="mt-2 text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}

export default PerformanceCard;