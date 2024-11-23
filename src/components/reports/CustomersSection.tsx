import RecentCustomers from "./RecentCustomers";
import TopSellingProducts from "./TopSellingProducts";

interface CustomersSectionProps {
  recentCustomers: Array<{
    customerName: string;
    date: Date;
    total: number;
  }>;
}

const CustomersSection = ({ recentCustomers }: CustomersSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentCustomers customers={recentCustomers} />
      <TopSellingProducts />
    </div>
  );
};

export default CustomersSection;