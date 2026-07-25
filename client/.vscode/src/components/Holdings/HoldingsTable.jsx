import { FaTrash, FaEdit, FaDownload, FaPrint } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { exportToCSV, printReport } from "../../utils/exportUtils";

function HoldingsTable({
  holdings,
  setHoldings,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  onEditHolding,
}) {
  const { token } = useAuth();

  const handleExportCSV = () => {
    const formattedData = holdings.map((h) => ({
      Symbol: h.symbol,
      Quantity: h.quantity,
      "Avg Price (INR)": h.avgPrice,
      "Current Price (INR)": h.currentPrice,
      "Invested (INR)": h.quantity * h.avgPrice,
      "Current Value (INR)": h.quantity * h.currentPrice,
      "Profit/Loss (INR)": h.quantity * h.currentPrice - h.quantity * h.avgPrice,
    }));
    exportToCSV(formattedData, "Holdings_Report.csv");
  };

  // ===============================
  // Delete Holding
  // ===============================

  const deleteHolding = async (idToDelete) => {
    try {
      if (idToDelete) {
        const response = await fetch(`http://localhost:5000/api/holdings/${idToDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Failed to delete");
      }
      const updatedHoldings = holdings.filter(
        (stock, index) => stock._id ? stock._id !== idToDelete : index !== idToDelete
      );
      setHoldings(updatedHoldings);
    } catch (error) {
      console.error(error);
      alert("Error deleting holding");
    }
  };

  // ===============================
  // Search
  // ===============================

  const filteredHoldings = holdings.filter((stock) =>
    stock.symbol
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // ===============================
  // Sorting
  // ===============================

  const sortedHoldings = [...filteredHoldings];

  if (sortBy === "profit") {
    sortedHoldings.sort((a, b) => {
      const profitA =
        a.quantity * a.currentPrice -
        a.quantity * a.avgPrice;

      const profitB =
        b.quantity * b.currentPrice -
        b.quantity * b.avgPrice;

      return profitB - profitA;
    });
  }

  if (sortBy === "investment") {
    sortedHoldings.sort((a, b) => {
      return (
        b.quantity * b.avgPrice -
        a.quantity * a.avgPrice
      );
    });
  }

  return (
    <div id="printable-holdings" className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
      
      {/* Title only visible in print */}
      <div className="hidden print:block mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Holdings Report</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Search & Sort & Buttons (Hidden when printing) */}
      <div className="flex justify-between items-center mb-6 no-print">

        <input
          type="text"
          placeholder="Search Stock..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-lg px-4 py-2"
          >
            <option value="default">
              Default
            </option>

            <option value="profit">
              Highest Profit
            </option>

            <option value="investment">
              Highest Investment
            </option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer"
          >
            <FaDownload /> Export CSV
          </button>

          <button
            onClick={printReport}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer"
          >
            <FaPrint /> Print / PDF
          </button>
        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b dark:border-slate-700 text-left text-slate-500 dark:text-slate-400">

              <th className="pb-4">Stock</th>

              <th className="pb-4">Qty</th>

              <th className="pb-4">Avg Price</th>

              <th className="pb-4">Current Price</th>

              <th className="pb-4">Invested</th>

              <th className="pb-4">Current</th>

              <th className="pb-4">P/L</th>

              <th className="pb-4">Return %</th>

              <th className="pb-4 text-center no-print">
                Action
              </th>

            </tr>

          </thead>

          <tbody className="text-slate-700 dark:text-slate-300">

            {sortedHoldings.map((stock, index) => {

              const invested =
                stock.quantity * stock.avgPrice;

              const current =
                stock.quantity * stock.currentPrice;

              const profit =
                current - invested;

              const returnPercentage =
                invested > 0
                  ? (profit / invested) * 100
                  : 0;

              return (

                <tr
                  key={stock._id || index}
                  className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                >

                  <td className="py-4 font-semibold text-slate-900 dark:text-white">
                    {stock.symbol}
                  </td>

                  <td>{stock.quantity}</td>

                  <td>
                    ₹{stock.avgPrice.toLocaleString()}
                  </td>

                  <td>
                    ₹{stock.currentPrice.toLocaleString()}
                  </td>

                  <td>
                    ₹{invested.toLocaleString()}
                  </td>

                  <td>
                    ₹{current.toLocaleString()}
                  </td>

                  <td
                    className={`font-semibold ${
                      profit >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ₹{profit.toLocaleString()}
                  </td>

                  <td
                    className={`font-semibold ${
                      returnPercentage >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {returnPercentage.toFixed(2)}%
                  </td>

                  <td className="no-print">

                    <div className="flex justify-center gap-4">

                      <button
                        onClick={() => onEditHolding && onEditHolding(stock)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        title="Edit Holding"
                      >
                        <FaEdit size={18} />
                      </button>

                      <button
                        onClick={() =>
                          deleteHolding(stock._id || index)
                        }
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="Delete Holding"
                      >
                        <FaTrash size={18} />
                      </button>

                    </div>

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

export default HoldingsTable;