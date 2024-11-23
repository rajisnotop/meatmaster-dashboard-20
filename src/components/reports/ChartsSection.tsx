import ProfitTrendsChart from "./ProfitTrendsChart";
import ProductPerformance from "./ProductPerformance";

interface ChartsSectionProps {
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  productPerformance: Array<{
    name: string;
    sold: number;
    revenue: number;
    averagePrice: number;
    trend: number;
  }>;
}

const ChartsSection = ({ monthlyTrends, productPerformance }: ChartsSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProfitTrendsChart data={monthlyTrends} />
      <ProductPerformance data={productPerformance} />
    </div>
  );
};

export default ChartsSection;