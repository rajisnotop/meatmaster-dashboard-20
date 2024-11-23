import { DollarSign, Receipt, TrendingUp, CreditCard } from "lucide-react";
import MetricCard from "./MetricCard";

interface MetricsOverviewProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  averageOrderValue: number;
}

const MetricsOverview = ({
  totalRevenue,
  totalExpenses,
  netProfit,
  averageOrderValue,
}: MetricsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        icon={DollarSign}
        title="Total Revenue"
        value={`NPR ${totalRevenue.toLocaleString()}`}
      />
      <MetricCard
        icon={Receipt}
        title="Total Expenses"
        value={`NPR ${totalExpenses.toLocaleString()}`}
      />
      <MetricCard
        icon={TrendingUp}
        title="Net Amount"
        value={`NPR ${netProfit.toLocaleString()}`}
      />
      <MetricCard
        icon={CreditCard}
        title="Average Order"
        value={`NPR ${averageOrderValue.toLocaleString()}`}
      />
    </div>
  );
};

export default MetricsOverview;