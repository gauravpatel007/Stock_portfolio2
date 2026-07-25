import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { holdings as initialHoldings } from "../Data/holdingsData";
import { transactions } from "../Data/transactionsData";

import usePortfolioAnalytics from "../hooks/usePortfolioAnalytics";

import WelcomeSection from "../components/Dashboard/WelcomeSection";
import SummarySection from "../components/Dashboard/SummarySection";
import ChartsSection from "../components/Dashboard/ChartsSection";
import PortfolioInsights from "../components/Insights/PortfolioInsights";
import PerformanceSection from "../components/Performance/PerformanceSection";
import HoldingForm from "../components/Holdings/HoldingForm";
import HoldingsTable from "../components/Holdings/HoldingsTable";
import TransactionTable from "../components/Transactions/TransactionTable";

function Dashboard({ triggerNotificationRefresh }) {
  const [holdings, setHoldings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [editingHolding, setEditingHolding] = useState(null);

  const { user, token } = useAuth();

  // ==========================
  // Fetch from Backend
  // ==========================

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/holdings", {
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

  // ==========================
  // Portfolio Analytics
  // ==========================

  const analytics = usePortfolioAnalytics(holdings);

  // Derive transactions from holdings for current user
  const userTransactions = holdings.map((h, index) => ({
    id: h._id || index,
    date: h.createdAt ? new Date(h.createdAt).toISOString().split("T")[0] : "Today",
    type: "BUY",
    symbol: h.symbol,
    quantity: h.quantity,
    price: h.avgPrice,
  }));

  // ==========================
  // UI
  // ==========================

  return (
    <main className="max-w-7xl mx-auto px-8 py-8">

      {/* Welcome */}
      <WelcomeSection userName={user?.name} totalProfit={analytics.totalProfit} />

      {/* Summary Cards */}
      <SummarySection
        totalInvestment={analytics.totalInvestment}
        currentValue={analytics.currentValue}
        totalProfit={analytics.totalProfit}
        totalReturn={analytics.totalReturn}
      />

      {/* Charts */}
      <ChartsSection
        allocationData={analytics.allocationData}
        sectorAllocationData={analytics.sectorAllocationData}
        currentValue={analytics.currentValue}
      />

      {/* Portfolio Insights */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Portfolio Insights
        </h2>

        <PortfolioInsights holdings={holdings} />
      </section>

      {/* Performance Overview */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Performance Overview
        </h2>

        <PerformanceSection analytics={analytics} />
      </section>

      {/* Holdings */}
      <section className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            My Holdings
          </h2>

          <HoldingForm
            setHoldings={setHoldings}
            editHolding={editingHolding}
            isEditing={!!editingHolding}
            onCloseEditModal={() => setEditingHolding(null)}
            triggerNotificationRefresh={triggerNotificationRefresh}
          />
        </div>

        <HoldingsTable
          holdings={holdings}
          setHoldings={setHoldings}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onEditHolding={(stock) => setEditingHolding(stock)}
        />
      </section>

      {/* Transaction History */}
      <section className="mt-12">
        <TransactionTable
          transactions={userTransactions}
        />
      </section>

      {/* Footer / Advanced Features Link */}
      <footer className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-xl no-print">
        <div className="text-left mb-6 md:mb-0">
          <h3 className="text-2xl font-bold mb-2">Want to level up your portfolio?</h3>
          <p className="text-blue-100 max-w-lg">
            Use our pro tools to calculate exact buy/sell amounts for rebalancing and set target price alerts.
          </p>
        </div>
        <a
          href="/advanced"
          className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-slate-50 px-8 py-3.5 rounded-full font-bold shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Explore Advanced Features
        </a>
      </footer>

    </main>
  );
}

export default Dashboard;