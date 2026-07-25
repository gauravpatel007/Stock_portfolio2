import { useState, useEffect } from "react";
import { Scale, AlertCircle, ArrowRightLeft, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function RebalanceSection({ holdings, triggerNotificationRefresh }) {
  const { token } = useAuth();
  const [targetPercentages, setTargetPercentages] = useState({});

  useEffect(() => {
    const initialPercentages = {};
    holdings.forEach(h => {
      initialPercentages[h.symbol] = h.targetPercentage || 0;
    });
    setTargetPercentages(initialPercentages);
  }, [holdings]);

  const totalPortfolioValue = holdings.reduce(
    (sum, h) => sum + h.quantity * h.currentPrice,
    0
  );

  const handlePercentageChange = (symbol, value) => {
    setTargetPercentages({
      ...targetPercentages,
      [symbol]: Number(value),
    });
  };

  const savePercentageToDB = async (holdingId, value) => {
    try {
      await fetch(`http://localhost:5000/api/holdings/${holdingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetPercentage: Number(value) }),
      });
    } catch (error) {
      console.error("Error saving target percentage:", error);
    }
  };

  const handleSendRebalanceNotification = async () => {
    if (!holdings.length) return;
    try {
      await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "⚖️ Portfolio Rebalance Notice",
          message: "Check your portfolio rebalance recommendations to maintain your target allocation.",
          type: "REBALANCE_ALERT",
        }),
      });
      if (triggerNotificationRefresh) triggerNotificationRefresh();
      alert("Rebalance alert sent to Notification Center!");
    } catch (e) {
      console.error(e);
    }
  };

  if (!holdings || holdings.length === 0) {
    return null;
  }

  return (
    <div className="relative rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-100 dark:border-indigo-800/50 p-8 mt-12 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-900/20 dark:via-slate-800 dark:to-purple-900/20 transition-colors">
      {/* Premium Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg">
              <Scale className="text-indigo-600 w-6 h-6" />
            </div>
            Target Allocation & Rebalancing Calculator
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 ml-11">
            Set your target portfolio percentages to see exact Buy/Sell recommendations to stay balanced.
          </p>
        </div>

        <button
          onClick={handleSendRebalanceNotification}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <Bell className="w-4 h-4" /> Push Rebalance Alert
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
              <th className="pb-3">Stock</th>
              <th className="pb-3">Current Value</th>
              <th className="pb-3">Current %</th>
              <th className="pb-3">Target %</th>
              <th className="pb-3">Target Value</th>
              <th className="pb-3 text-right">Rebalance Action</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => {
              const currentVal = h.quantity * h.currentPrice;
              const currentPct = totalPortfolioValue > 0 ? (currentVal / totalPortfolioValue) * 100 : 0;
              const targetPct = targetPercentages[h.symbol] !== undefined ? targetPercentages[h.symbol] : (h.targetPercentage || 0);
              const targetVal = (totalPortfolioValue * targetPct) / 100;
              const diff = targetVal - currentVal;

              return (
                <tr key={h._id || h.symbol} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 font-bold text-slate-900 dark:text-white">{h.symbol}</td>
                  <td className="font-semibold text-slate-700 dark:text-slate-300">₹{currentVal.toLocaleString()}</td>
                  <td className="font-medium text-slate-600 dark:text-slate-400">{currentPct.toFixed(1)}%</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={targetPercentages[h.symbol] !== undefined ? targetPercentages[h.symbol] : (h.targetPercentage || "")}
                        onChange={(e) => handlePercentageChange(h.symbol, e.target.value)}
                        onBlur={(e) => savePercentageToDB(h._id, e.target.value)}
                        className="w-20 border dark:border-slate-600 bg-transparent dark:text-white rounded-lg p-1.5 text-center font-semibold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <span className="text-slate-500 dark:text-slate-400 text-sm">%</span>
                    </div>
                  </td>
                  <td className="font-semibold text-slate-700 dark:text-slate-300">₹{targetVal.toLocaleString()}</td>
                  <td className="text-right">
                    {diff === 0 ? (
                      <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">Balanced</span>
                    ) : diff > 0 ? (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                        BUY +₹{Math.round(diff).toLocaleString()}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full text-xs font-bold">
                        SELL -₹{Math.round(Math.abs(diff)).toLocaleString()}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RebalanceSection;
