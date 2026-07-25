function InsightCard({
  title,
  value,
  subtitle,
  icon,
  color,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">

      <div className="flex justify-between items-center">

        <h3 className="text-slate-500 dark:text-slate-400 font-medium">
          {title}
        </h3>

        <div className={`text-3xl ${color}`}>
          {icon}
        </div>

      </div>

      <h2 className="text-2xl font-bold mt-6 text-slate-900 dark:text-white">
        {value}
      </h2>

      <p className={`mt-2 font-semibold ${color}`}>
        {subtitle}
      </p>

    </div>
  );
}

export default InsightCard;