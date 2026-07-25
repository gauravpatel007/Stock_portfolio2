import SummaryCard from "../Cards/SummaryCard";
import {
  Wallet,
  TrendingUp,
  IndianRupee,
  BarChart3,
} from "lucide-react";

function SummarySection({
  totalInvestment,
  currentValue,
  totalProfit,
  totalReturn,
}) {
  const summaryCards = [
    {
      title: "Current Value",
      amount: `₹${currentValue.toLocaleString()}`,
      trend: "Portfolio Value",
      trendColor: "text-emerald-600",
      icon: TrendingUp,
    },
    {
      title: "Total Investment",
      amount: `₹${totalInvestment.toLocaleString()}`,
      trend: "Invested Capital",
      trendColor: "text-blue-600",
      icon: Wallet,
    },
    {
      title: "Total Profit",
      amount: `${totalProfit >= 0 ? "+" : "-"}₹${Math.abs(
        totalProfit
      ).toLocaleString()}`,
      trend:
        totalProfit >= 0 ? "Overall Profit" : "Overall Loss",
      trendColor:
        totalProfit >= 0
          ? "text-green-600"
          : "text-red-600",
      icon: IndianRupee,
    },
    {
      title: "Return %",
      amount: `${totalReturn.toFixed(2)}%`,
      trend: "Overall Return",
      trendColor:
        totalReturn >= 0
          ? "text-green-600"
          : "text-red-600",
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mt-8">
      {summaryCards.map((card, index) => (
        <SummaryCard
          key={index}
          title={card.title}
          amount={card.amount}
          icon={card.icon}
          trend={card.trend}
          trendColor={card.trendColor}
        />
      ))}
    </div>
  );
}

export default SummarySection;