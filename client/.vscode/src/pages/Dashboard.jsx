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
import TransactionModal from "../components/Holdings/TransactionModal";

function Dashboard({ triggerNotificationRefresh }) {
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [editingHolding, setEditingHolding] = useState(null);
  const [transactionHolding, setTransactionHolding] = useState(null);
  const [transactionRefreshTrigger, setTransactionRefreshTrigger] = useState(0);

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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (token) {
      fetchTransactions();
    }
  }, [token, transactionRefreshTrigger]);

  // ==========================
  // Portfolio Analytics
  // ==========================

  const analytics = usePortfolioAnalytics(holdings);

  // Transactions are now fetched from backend

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
        typeAllocationData={analytics.typeAllocationData}
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
            onTransactionSuccess={() => setTransactionRefreshTrigger((prev) => prev + 1)}
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
          onTransactionHolding={(stock) => setTransactionHolding(stock)}
        />
        {transactionHolding && (
          <TransactionModal
            holding={transactionHolding}
            onClose={() => setTransactionHolding(null)}
            setHoldings={setHoldings}
            onTransactionSuccess={() => setTransactionRefreshTrigger((prev) => prev + 1)}
          />
        )}
      </section>

      {/* Transaction History */}
      <section className="mt-12">
        <TransactionTable
          transactions={transactions}
        />
      </section>

      {/* Tagline */}
      <div className="mt-10 mb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-800/50 rounded-2xl py-8 px-6 text-center border border-blue-100/50 dark:border-slate-700 no-print w-full">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Built for investors who value <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">clarity</span> over complexity.
        </h3>
      </div>

    </main>
  );
}

export default Dashboard;