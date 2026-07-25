import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#9333EA",
];

function AllocationChart({ allocationData, sectorAllocationData = [], typeAllocationData = [] }) {
  const [viewBy, setViewBy] = useState("stock");
  const displayData = 
    viewBy === "stock" 
      ? allocationData 
      : viewBy === "sector" 
        ? sectorAllocationData 
        : typeAllocationData;

  const totalValue = displayData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Portfolio Allocation
        </h2>
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => setViewBy("stock")}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all cursor-pointer ${
              viewBy === "stock"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            By Stock
          </button>
          <button
            onClick={() => setViewBy("sector")}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all cursor-pointer ${
              viewBy === "sector"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            By Sector
          </button>
          <button
            onClick={() => setViewBy("type")}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all cursor-pointer ${
              viewBy === "type"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            By Type
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">

        <div className="h-72">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={displayData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                paddingAngle={4}
                stroke="none"
                label
              >
                {displayData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

        <div className="space-y-4">

          {displayData.map((item, index) => {

            const percentage =
              ((item.value / totalValue) * 100).toFixed(1);

            return (
              <div
                key={item.name}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-3">

                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="font-medium text-slate-900 dark:text-white">
                    {item.name}
                  </span>

                </div>

                <div className="text-right">

                  <p className="font-semibold text-slate-900 dark:text-white">
                    ₹{item.value.toLocaleString()}
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {percentage}%
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default AllocationChart;