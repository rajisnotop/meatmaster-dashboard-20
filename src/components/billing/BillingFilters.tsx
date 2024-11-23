import React from "react";
import AdvancedFilters from "@/components/shared/AdvancedFilters";

interface BillingFiltersProps {
  onFilterChange: (filters: any) => void;
  products: Array<{ id: string; name: string }>;
}

const BillingFilters = ({ onFilterChange, products }: BillingFiltersProps) => {
  return (
    <AdvancedFilters
      onFilterChange={onFilterChange}
      showPaymentFilter
      showAmountFilter
      showDateFilter
      showProductFilter
      products={products}
    />
  );
};

export default BillingFilters;