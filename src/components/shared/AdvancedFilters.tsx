import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import DateRangeSelector from "../billing/DateRangeSelector";

interface AdvancedFiltersProps {
  onFilterChange: (filters: any) => void;
  showPaymentFilter?: boolean;
  showAmountFilter?: boolean;
  showDateFilter?: boolean;
  showProductFilter?: boolean;
  showCategoryFilter?: boolean;
  products?: Array<{ id: string; name: string }>;
  categories?: string[];
}

const AdvancedFilters = ({
  onFilterChange,
  showPaymentFilter = true,
  showAmountFilter = true,
  showDateFilter = true,
  showProductFilter = true,
  showCategoryFilter = false,
  products = [],
  categories = [],
}: AdvancedFiltersProps) => {
  const [filters, setFilters] = React.useState({
    paymentStatus: "all",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    productId: "all",
    category: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-background">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>
            Apply filters to find specific items
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          {showPaymentFilter && (
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select
                value={filters.paymentStatus}
                onValueChange={(value) => handleFilterChange("paymentStatus", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="qr">Paid with QR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {showAmountFilter && (
            <div className="space-y-2">
              <Label>Amount Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                  className="bg-background"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
          )}

          {showDateFilter && (
            <div className="space-y-2">
              <Label>Date Range</Label>
              <DateRangeSelector
                startDate={filters.startDate}
                endDate={filters.endDate}
                setStartDate={(date) => handleFilterChange("startDate", date || "")}
                setEndDate={(date) => handleFilterChange("endDate", date || "")}
              />
            </div>
          )}

          {showProductFilter && products.length > 0 && (
            <div className="space-y-2">
              <Label>Product</Label>
              <Select
                value={filters.productId}
                onValueChange={(value) => handleFilterChange("productId", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showCategoryFilter && categories.length > 0 && (
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFilters;