import {
  Trophy,
  TrendingDown,
  Wallet,
  Boxes,
} from "lucide-react";

import InsightCard from "./InsightCard";

function PortfolioInsights({ holdings }) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-slate-500 mt-8">
        No holdings yet. Add some to see insights!
      </div>
    );
  }

  const bestPerformer = [...holdings].sort(
    (a, b) =>
      ((b.currentPrice - b.avgPrice) / b.avgPrice) -
      ((a.currentPrice - a.avgPrice) / a.avgPrice)
  )[0];

  const worstPerformer = [...holdings].sort(
    (a, b) =>
      ((a.currentPrice - a.avgPrice) / a.avgPrice) -
      ((b.currentPrice - b.avgPrice) / b.avgPrice)
  )[0];

  const largestHolding = [...holdings].sort(
    (a, b) =>
      b.quantity * b.currentPrice -
      a.quantity * a.currentPrice
  )[0];

  return (
    <div className="grid grid-cols-4 gap-6 mt-8">

      <InsightCard
        title="Best Performer"
        value={bestPerformer.symbol}
        subtitle={`+${(
          ((bestPerformer.currentPrice -
            bestPerformer.avgPrice) /
            bestPerformer.avgPrice) *
          100
        ).toFixed(2)}%`}
        icon={<Trophy />}
        color="text-green-600"
      />

      <InsightCard
        title="Worst Performer"
        value={worstPerformer.symbol}
        subtitle={`${(
          ((worstPerformer.currentPrice -
            worstPerformer.avgPrice) /
            worstPerformer.avgPrice) *
          100
        ).toFixed(2)}%`}
        icon={<TrendingDown />}
        color="text-red-600"
      />

      <InsightCard
        title="Largest Holding"
        value={largestHolding.symbol}
        subtitle={`₹${(
          largestHolding.quantity *
          largestHolding.currentPrice
        ).toLocaleString()}`}
        icon={<Wallet />}
        color="text-blue-600"
      />

      <InsightCard
        title="Total Holdings"
        value={holdings.length}
        subtitle="Stocks"
        icon={<Boxes />}
        color="text-purple-600"
      />

    </div>
  );
}

export default PortfolioInsights;