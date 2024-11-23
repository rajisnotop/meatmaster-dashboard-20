import React from "react";
import AdvancedFilters from "@/components/shared/AdvancedFilters";

interface ExpenseFiltersProps {
  onFilterChange: (filters: any) => void;
}

const ExpenseFilters = ({ onFilterChange }: ExpenseFiltersProps) => {
  const expenseCategories = [
    "Utilities",
    "Supplies",
    "Maintenance",
    "Salary",
    "Other"
  ];

  return (
    <AdvancedFilters
      onFilterChange={onFilterChange}
      showPaymentFilter={false}
      showAmountFilter
      showDateFilter
      showProductFilter={false}
      showCategoryFilter
      categories={expenseCategories}
    />
  );
};

export default ExpenseFilters;