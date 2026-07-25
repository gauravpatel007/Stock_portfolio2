import { useState, useEffect } from "react";
import { Eye, Bell, Trash2, Plus, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config";

function WatchlistSection({ holdings, triggerNotificationRefresh }) {
  const [watchlist, setWatchlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { token } = useAuth();

  // Form State
  const [symbol, setSymbol] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState("ABOVE");
  const [frequency, setFrequency] = useState("EVERY_TIME"); // 'EVERY_TIME' or 'ONCE'
  const [notes, setNotes] = useState("");

  // Fetch Watchlist
  const fetchWatchlist = async () => {
    try {
      const res = await fetch(`${API_URL}/api/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch watchlist");
      const data = await res.json();
      setWatchlist(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWatchlist();
    }
  }, [token]);

  // Evaluate Triggers against current market holdings
  useEffect(() => {
    if (!watchlist.length || !holdings) return;

    watchlist.forEach(async (item) => {
      if (!item.active) return;

      // Find if we have current price for this stock in holdings or test defaults
      const matchedHolding = holdings.find((h) => h.symbol.toUpperCase() === item.symbol.toUpperCase());
      const currentPrice = matchedHolding ? matchedHolding.currentPrice : null;

      if (currentPrice !== null) {
        let isTriggered = false;
        if (item.condition === "ABOVE" && currentPrice >= item.targetPrice) {
          isTriggered = true;
        } else if (item.condition === "BELOW" && currentPrice <= item.targetPrice) {
          isTriggered = true;
        }

        if (isTriggered) {
          // Send notification alert to backend
          try {
            await fetch(`${API_URL}/api/notifications`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                title: `🚨 Price Alert: ${item.symbol}`,
                message: `${item.symbol} reached ₹${currentPrice.toLocaleString()} (Target: ${item.condition} ₹${item.targetPrice.toLocaleString()}) - Frequency: ${item.frequency === "ONCE" ? "Triggered Once" : "Every Time"}`,
                type: "PRICE_ALERT",
              }),
            });

            if (triggerNotificationRefresh) triggerNotificationRefresh();

            // If frequency is 'ONCE', deactivate the trigger in DB
            if (item.frequency === "ONCE") {
              await fetch(`${API_URL}/api/watchlist/${item._id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ active: false }),
              });
              setWatchlist((prev) =>
                prev.map((w) => (w._id === item._id ? { ...w, active: false } : w))
              );
            }
          } catch (e) {
            console.error("Error pushing alert:", e);
          }
        }
      }
    });
  }, [holdings]);

  const handleAddWatchlist = async (e) => {
    e.preventDefault();
    if (!symbol || !targetPrice) {
      alert("Please enter symbol and target price");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol,
          targetPrice: Number(targetPrice),
          condition,
          frequency,
          notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to add");
      const newItem = await res.json();
      setWatchlist([newItem, ...watchlist]);

      // Reset form
      setSymbol("");
      setTargetPrice("");
      setNotes("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error adding alert");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/watchlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setWatchlist(watchlist.filter((w) => w._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/watchlist/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setWatchlist(
        watchlist.map((w) => (w._id === id ? { ...w, active: !currentStatus } : w))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-100 dark:border-blue-800/50 p-8 mt-12 overflow-hidden bg-gradient-to-br from-cyan-50/40 via-white to-blue-50/30 dark:from-cyan-900/20 dark:via-slate-800 dark:to-blue-900/20 transition-colors">
      {/* Premium Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
              <Eye className="text-blue-600 w-6 h-6" />
            </div>
            Watchlist & Price Trigger Alerts
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 ml-11">
            Set target price alerts with options to trigger <strong>Every Time</strong> or <strong>Only Once</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Add Price Alert
        </button>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400 border border-dashed dark:border-slate-700 rounded-xl">
          No price alerts set. Click "+ Add Price Alert" to create one!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                <th className="pb-3">Stock Symbol</th>
                <th className="pb-3">Target Price</th>
                <th className="pb-3">Condition</th>
                <th className="pb-3">Frequency Rule</th>
                <th className="pb-3">Alert Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => (
                <tr key={item._id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 font-bold text-slate-900 dark:text-white">{item.symbol}</td>
                  <td className="font-semibold text-slate-700 dark:text-slate-300">₹{item.targetPrice.toLocaleString()}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.condition === "ABOVE"
                          ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {item.condition === "ABOVE" ? "Above ≥" : "Below ≤"}
                    </span>
                  </td>
                  <td>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                      {item.frequency === "ONCE" ? "⚡ Trigger Once" : "🔄 Every Time"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActive(item._id, item.active)}
                      className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition ${
                        item.active
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {item.active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-800 p-2 cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-[480px] shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              Create Stock Price Alert
            </h2>

            <form onSubmit={handleAddWatchlist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Stock Symbol
                </label>
                <input
                  type="text"
                  placeholder="e.g. RELIANCE, TCS, AAPL"
                  required
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full border dark:border-slate-600 bg-transparent dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 3500"
                  required
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full border dark:border-slate-600 bg-transparent dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full border dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl p-3"
                  >
                    <option value="ABOVE">Price Goes Above ≥</option>
                    <option value="BELOW">Price Goes Below ≤</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Trigger Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full border dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl p-3"
                  >
                    <option value="EVERY_TIME">Every Time</option>
                    <option value="ONCE">Only Once</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer"
                >
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WatchlistSection;
