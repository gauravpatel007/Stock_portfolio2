import PerformanceCard from "./PerformanceCard";

function PerformanceSection({ analytics }) {
  return (
    <div className="grid grid-cols-4 gap-6 mt-8">

      <PerformanceCard
        title="Current Portfolio Value"
        value={`₹${analytics.currentValue.toLocaleString()}`}
        subtitle="Current Market Value"
        color="text-blue-600"
      />

      <PerformanceCard
        title="Overall Profit"
        value={`₹${analytics.totalProfit.toLocaleString()}`}
        subtitle={`${analytics.totalReturn.toFixed(2)}% Return`}
        color={
          analytics.totalProfit >= 0
            ? "text-green-600"
            : "text-red-600"
        }
      />

      <PerformanceCard
        title="Total Investment"
        value={`₹${analytics.totalInvestment.toLocaleString()}`}
        subtitle="Invested Capital"
        color="text-purple-600"
      />

      <PerformanceCard
        title="Total Holdings"
        value={analytics.allocationData.length}
        subtitle="Assets"
        color="text-orange-600"
      />

    </div>
  );
}

export default PerformanceSection;