function WelcomeSection({ userName, totalProfit = 0 }) {
  const isPositive = totalProfit >= 0;

  return (
    <div className="relative mt-4">
      {/* Optional decorative glow behind the card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-3xl blur opacity-50"></div>
      
      <section className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-950 rounded-2xl shadow-xl border border-blue-100 dark:border-indigo-800/50 p-8 flex justify-between items-center text-slate-900 dark:text-white overflow-hidden transition-colors">
        {/* Abstract decorative shape */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-200/20 dark:bg-blue-400/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-200/20 dark:bg-indigo-400/5 blur-3xl"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Greeting, {userName || "User"} 👋
          </h2>

          <p className="text-slate-500 dark:text-indigo-200/70 mt-2 text-lg font-medium">
            Here's how your portfolio is performing today.
          </p>
        </div>

        <div className="text-right relative z-10">
          <p className="text-sm text-slate-500 dark:text-indigo-300 font-bold uppercase tracking-wider mb-1">Total Profit</p>

          <h2 className={`text-4xl font-bold ${isPositive ? "text-green-600 drop-shadow-[0_0_15px_rgba(22,163,74,0.15)]" : "text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.15)]"}`}>
            {isPositive ? "+" : ""}₹{totalProfit.toLocaleString()}
          </h2>
        </div>
      </section>
    </div>
  );
}

export default WelcomeSection;