import PortfolioChart from "../Charts/PortfolioChart";
import AllocationChart from "../Charts/AllocationChart";

function ChartsSection({ allocationData, sectorAllocationData, typeAllocationData, currentValue }) {
  return (
    <div className="grid grid-cols-2 gap-6 mt-8">

      <PortfolioChart currentValue={currentValue} />

      <AllocationChart
        allocationData={allocationData}
        sectorAllocationData={sectorAllocationData}
        typeAllocationData={typeAllocationData}
      />

    </div>
  );
}

export default ChartsSection;