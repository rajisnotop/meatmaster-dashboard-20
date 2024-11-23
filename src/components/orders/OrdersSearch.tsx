import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AdvancedFilters from "@/components/shared/AdvancedFilters";
import { useStore } from "@/store/store";

interface OrdersSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchDate: string;
  setSearchDate: (value: string) => void;
  onFilterChange: (filters: any) => void;
}

const OrdersSearch = ({
  searchTerm,
  setSearchTerm,
  searchDate,
  setSearchDate,
  onFilterChange,
}: OrdersSearchProps) => {
  const { products } = useStore();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-background/60 backdrop-blur-sm border-border/50"
        />
      </div>
      <div className="relative w-full sm:w-auto">
        <Input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="bg-background/60 backdrop-blur-sm border-border/50 w-full"
        />
      </div>
      <AdvancedFilters
        onFilterChange={onFilterChange}
        products={products}
        showPaymentFilter
        showAmountFilter
        showDateFilter
        showProductFilter
      />
    </div>
  );
};

export default OrdersSearch;