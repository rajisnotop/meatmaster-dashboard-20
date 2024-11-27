import { useState } from "react";
import { useStore } from "@/store/store";
import BillingHeader from "@/components/billing/BillingHeader";
import BillingCard from "@/components/billing/BillingCard";
import BillingTable from "@/components/billing/BillingTable";
import BillingPrintTemplate from "@/components/billing/BillingPrintTemplate";

const Billing = () => {
  const { expenses } = useStore();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isPrintTemplateOpen, setIsPrintTemplateOpen] = useState(false);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const openingBalance = 0; // This should be calculated or fetched from your state
  const cashInCounter = 0; // This should be calculated based on your business logic
  const netProfit = 0; // This should be calculated based on your business logic

  const handlePrint = (type: "all" | "selected") => {
    if (type === "selected" && selectedProducts.length === 0) {
      alert("Please select at least one product to print.");
      return;
    }
    setIsPrintTemplateOpen(true);
  };

  const handleExportExcel = () => {
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
        productTotals={[]} // Add your product totals here
        totalExpenses={totalExpenses}
        openingBalance={openingBalance}
        cashInCounter={cashInCounter}
        netProfit={netProfit}
      />
      <BillingTable
        productTotals={[]} // Add your product totals here
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        overallTotals={{
          quantity: 0,
          sales: 0,
          unpaid: 0,
          unpaidToPaidQR: 0,
          paidWithQR: 0,
        }}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        openingBalance={openingBalance}
        setOpeningBalance={() => {}} // Add your setter function here
      />
      {isPrintTemplateOpen && (
        <BillingPrintTemplate
          productTotals={[]} // Add your product totals here
          type="all"
          overallTotals={{
            sales: 0,
            paidWithQR: 0,
            unpaid: 0,
            unpaidToPaidQR: 0,
          }}
          totalExpenses={totalExpenses}
          openingBalance={openingBalance}
          netProfit={netProfit}
        />
      )}
    </div>
  );
};

export default Billing;