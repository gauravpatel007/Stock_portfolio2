import { useState, useEffect } from "react";
import { List, Trash2, Plus, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config";

function SimpleWatchlistSection() {
  const [watchlist, setWatchlist] = useState([]);
  const [symbol, setSymbol] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await fetch(`${API_URL}/api/simple-watchlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setWatchlist(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchWatchlist();
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!symbol) return;

    try {
      const res = await fetch(`${API_URL}/api/simple-watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol: symbol.toUpperCase() }),
      });

      if (!res.ok) throw new Error("Failed to add");
      const newItem = await res.json();
      setWatchlist([newItem, ...watchlist]);
      setSymbol("");
    } catch (err) {
      console.error(err);
      alert("Error adding stock or it already exists in your watchlist.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/simple-watchlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setWatchlist(watchlist.filter((w) => w._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100 dark:border-orange-900/50 p-6 mt-12 overflow-hidden bg-gradient-to-br from-orange-50/40 via-white to-orange-50/20 dark:from-orange-900/20 dark:via-slate-800 dark:to-orange-900/20 h-full transition-colors">
      {/* Premium Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-amber-500"></div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/40 rounded-lg">
              <List className="text-orange-500 w-5 h-5" />
            </div>
            Stock Watchlist
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 ml-10">
            Keep an eye on symbols.
          </p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Symbol (e.g. AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
            className="w-full pl-9 pr-3 py-2 bg-transparent dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm font-bold uppercase"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 rounded-xl flex items-center gap-1 font-bold text-sm shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="space-y-2">
        {watchlist.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm border border-dashed rounded-xl border-slate-200 dark:border-slate-700">
            No stocks tracked yet.
          </div>
        ) : (
          watchlist.map((item) => (
            <div key={item._id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600/50 shadow-sm hover:shadow-md transition">
              <span className="font-bold text-slate-800 dark:text-white text-lg">{item.symbol}</span>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 p-1.5 rounded-lg transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SimpleWatchlistSection;
