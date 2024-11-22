import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";

interface OrdersSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchDate: string;
  setSearchDate: (value: string) => void;
}

const OrdersSearch = ({
  searchTerm,
  setSearchTerm,
  searchDate,
  setSearchDate,
}: OrdersSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-background/60 backdrop-blur-sm"
        />
      </div>
      <div className="relative w-full sm:w-auto">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="pl-9 bg-background/60 backdrop-blur-sm w-full"
        />
      </div>
    </div>
  );
};

export default OrdersSearch;