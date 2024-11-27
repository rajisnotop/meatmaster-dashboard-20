import { useState, useEffect } from "react";
import { useExpenseStore } from "@/store/expenseStore";
import { useBillingStore } from "@/store/billingStore";
import BillingHeader from "@/components/billing/BillingHeader";
import BillingTable from "@/components/billing/BillingTable";
import BillingPrintTemplate from "@/components/billing/BillingPrintTemplate";
import { calculateProductTotals, calculateOverallTotals } from "@/utils/billingCalculations";

const Billing = () => {
  const { expenses } = useExpenseStore();
  const { orders, products } = useBillingStore();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isPrintTemplateOpen, setIsPrintTemplateOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(0);

  const filterDateFn = (date: Date) => {
    if (timeFilter === "date-range" && startDate && endDate) {
      return date >= new Date(startDate) && date <= new Date(endDate);
    }
    if (dateFilter) {
      return date.toISOString().split('T')[0] === dateFilter;
    }
    return true;
  };

  const productTotals = calculateProductTotals(products, orders, filterDateFn);
  const overallTotals = calculateOverallTotals(productTotals);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = (overallTotals.sales || 0) - totalExpenses;

  const handlePrint = (type: "all" | "selected") => {
    if (type === "selected" && selectedProducts.length === 0) {
      alert("Please select at least one product to print.");
      return;
    }
    setIsPrintTemplateOpen(true);
  };

  const handleExportExcel = () => {
    // Implementation remains the same
    // Implement Excel export logic
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <BillingHeader
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        selectedProducts={selectedProducts}
        onPrint={handlePrint}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onExportExcel={handleExportExcel}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        productTotals={productTotals}
        totalExpenses={totalExpenses}
        openingBalance={openingBalance}
        cashInCounter={0}
        netProfit={netProfit}
      />
      <BillingTable
        productTotals={productTotals}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        overallTotals={overallTotals}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        openingBalance={openingBalance}
        setOpeningBalance={setOpeningBalance}
      />
      {isPrintTemplateOpen && (
        <BillingPrintTemplate
          productTotals={productTotals}
          type="all"
          overallTotals={overallTotals}
          totalExpenses={totalExpenses}
          openingBalance={openingBalance}
          netProfit={netProfit}
        />
      )}
    </div>
  );
};

export default Billing;
