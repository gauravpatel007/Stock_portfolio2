import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";
import RebalanceSection from "../components/Rebalance/RebalanceSection";
import WatchlistSection from "../components/Watchlist/WatchlistSection";
import SimpleWatchlistSection from "../components/Watchlist/SimpleWatchlistSection";

function AdvancedFeatures({ triggerNotificationRefresh }) {
  const [holdings, setHoldings] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/holdings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setHoldings(data);
      } catch (error) {
        console.error("Error fetching holdings:", error);
      }
    };

    if (token) {
      fetchHoldings();
    }
  }, [token]);

  return (
    <main className="max-w-7xl mx-auto px-8 py-10 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition mb-2 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-500" />
            Advanced Features
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Pro tools to rebalance your portfolio and track target prices.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Takes up 2/3 of space) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Rebalance Calculator */}
          <RebalanceSection holdings={holdings} triggerNotificationRefresh={triggerNotificationRefresh} />

          {/* Watchlist Alerts */}
          <WatchlistSection holdings={holdings} triggerNotificationRefresh={triggerNotificationRefresh} />
        </div>

        {/* Right Column (Takes up 1/3 of space) */}
        <div className="lg:col-span-1">
          <SimpleWatchlistSection />
        </div>
      </div>

    </main>
  );
}

export default AdvancedFeatures;
