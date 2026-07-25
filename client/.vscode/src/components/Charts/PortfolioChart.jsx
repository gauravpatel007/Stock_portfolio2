import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

function PortfolioChart({ currentValue = 0 }) {
  const [timeframe, setTimeframe] = useState("6M");
  const { theme } = useTheme();

  const getDataForTimeframe = () => {
    switch (timeframe) {
      case "1M":
        return [
          { month: "Week 1", value: currentValue * 0.91 },
          { month: "Week 2", value: currentValue * 0.94 },
          { month: "Week 3", value: currentValue * 0.97 },
          { month: "Week 4", value: currentValue },
        ];
      case "3M":
        return [
          { month: "May", value: currentValue * 0.85 },
          { month: "Jun", value: currentValue * 0.92 },
          { month: "Jul", value: currentValue },
        ];
      case "6M":
        return [
          { month: "Feb", value: currentValue * 0.76 },
          { month: "Mar", value: currentValue * 0.81 },
          { month: "Apr", value: currentValue * 0.84 },
          { month: "May", value: currentValue * 0.89 },
          { month: "Jun", value: currentValue * 0.94 },
          { month: "Jul", value: currentValue },
        ];
      case "1Y":
        return [
          { month: "Aug", value: currentValue * 0.62 },
          { month: "Oct", value: currentValue * 0.71 },
          { month: "Dec", value: currentValue * 0.78 },
          { month: "Feb", value: currentValue * 0.85 },
          { month: "Apr", value: currentValue * 0.91 },
          { month: "Jul", value: currentValue },
        ];
      case "ALL":
        return [
          { month: "2023", value: currentValue * 0.35 },
          { month: "2024", value: currentValue * 0.58 },
          { month: "2025", value: currentValue * 0.82 },
          { month: "2026", value: currentValue },
        ];
      default:
        return [];
    }
  };

  const data = getDataForTimeframe();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Portfolio Growth
        </h2>

        {/* Timeframe Filter Buttons */}
        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl gap-1">
          {["1M", "3M", "6M", "1Y", "ALL"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === tf
                  ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="portfolioGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            {theme === "light" && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
              />
            )}

            <XAxis
              dataKey="month"
              tick={{ fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickFormatter={(value) =>
                value >= 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`
              }
              tick={{ fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value) =>
                [`₹${Math.round(value).toLocaleString()}`, "Portfolio"]
              }
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563EB"
              strokeWidth={3}
              fill="url(#portfolioGradient)"
              activeDot={{
                r: 6,
                stroke: "#2563EB",
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PortfolioChart;