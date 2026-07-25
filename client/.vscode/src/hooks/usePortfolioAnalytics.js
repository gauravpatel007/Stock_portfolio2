function usePortfolioAnalytics(holdings) {
  // ===============================
  // Portfolio Totals
  // ===============================

  const totalInvestment = holdings.reduce(
    (total, stock) => total + stock.quantity * stock.avgPrice,
    0
  );

  const currentValue = holdings.reduce(
    (total, stock) => total + stock.quantity * stock.currentPrice,
    0
  );

  const totalProfit = currentValue - totalInvestment;

  const totalReturn =
    totalInvestment > 0
      ? (totalProfit / totalInvestment) * 100
      : 0;

  // ===============================
  // Allocation Chart
  // ===============================

  const allocationData = holdings.map((stock) => ({
    name: stock.symbol,
    value: stock.quantity * stock.currentPrice,
  }));

  const sectorAllocationMap = {};
  holdings.forEach((stock) => {
    const sector = stock.sector || "Other";
    const value = stock.quantity * stock.currentPrice;
    if (sectorAllocationMap[sector]) {
      sectorAllocationMap[sector] += value;
    } else {
      sectorAllocationMap[sector] = value;
    }
  });

  const sectorAllocationData = Object.keys(sectorAllocationMap).map((sector) => ({
    name: sector,
    value: sectorAllocationMap[sector],
  }));

  // ===============================
  // Best Performer
  // ===============================

  const bestPerformer = [...holdings].sort(
    (a, b) =>
      ((b.currentPrice - b.avgPrice) / b.avgPrice) -
      ((a.currentPrice - a.avgPrice) / a.avgPrice)
  )[0];

  // ===============================
  // Worst Performer
  // ===============================

  const worstPerformer = [...holdings].sort(
    (a, b) =>
      ((a.currentPrice - a.avgPrice) / a.avgPrice) -
      ((b.currentPrice - b.avgPrice) / b.avgPrice)
  )[0];

  // ===============================
  // Largest Holding
  // ===============================

  const largestHolding = [...holdings].sort(
    (a, b) =>
      b.quantity * b.currentPrice -
      a.quantity * a.currentPrice
  )[0];

  return {
    totalInvestment,
    currentValue,
    totalProfit,
    totalReturn,
    allocationData,
    sectorAllocationData,
    bestPerformer,
    worstPerformer,
    largestHolding,
    totalHoldings: holdings.length,
  };
}

export default usePortfolioAnalytics;