import React, { useState } from "react";
import { useStore } from "@/store/store";
import { toast } from "sonner";
import BillingTable from "@/components/billing/BillingTable";
import BillingHeader from "@/components/billing/BillingHeader";
import BillingCard from "@/components/billing/BillingCard";
import Header from "@/components/Header";
import BillingPrintTemplate from "@/components/billing/BillingPrintTemplate";
import { calculateProductTotals, calculateOverallTotals } from "@/utils/billingCalculations";
import { isDateInRange, getDateRangeForFilter } from "@/utils/dateFilters";
import { exportToExcel } from "@/utils/excelExport";

const Billing = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  
  const { products, orders, expenses } = useStore();

  const filterData = (date: Date) => {
    if (timeFilter === "date-range" && startDate && endDate) {
      return isDateInRange(date, startDate, endDate);
    }

    if (dateFilter) {
      return isDateInRange(date, dateFilter, dateFilter);
    }

    const dateRange = getDateRangeForFilter(timeFilter, dateFilter);
    if (!dateRange) return true;
    
    return date >= dateRange.start && date <= dateRange.end;
  };

  const productTotals = calculateProductTotals(products, orders, filterData);
  const overallTotals = calculateOverallTotals(productTotals);

  const filteredExpenses = expenses.filter((expense) => filterData(new Date(expense.date)));
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = overallTotals.sales + overallTotals.paidWithQR + overallTotals.unpaid + overallTotals.unpaidToPaidQR - totalExpenses;

  const handleExportExcel = () => {
    try {
      exportToExcel(
        productTotals,
        timeFilter,
        startDate,
        endDate,
        netProfit,
        totalExpenses,
        openingBalance
      );
      toast.success('Excel file exported successfully');
    } catch (error) {
      toast.error('Failed to export Excel file');
    }
  };

  const handlePrint = (type: "all" | "selected") => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Unable to open print window");
      return;
    }

    const productsToShow =
      type === "all"
        ? productTotals
        : productTotals.filter((product) => selectedProducts.includes(product.id));

    const html = BillingPrintTemplate({
      productTotals: productsToShow,
      type,
      overallTotals,
      totalExpenses,
      openingBalance,
      netProfit
    });

    printWindow.document.write(html);
    printWindow.document.close();
    toast.success("Preparing print view...");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Billing
          </h1>
          <p className="text-muted-foreground">
            Generate and manage billing reports
          </p>
        </div>

        <BillingCard showTopSelling={true}>
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
          />
          <div className="mt-8">
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
          </div>
        </BillingCard>
      </main>
    </div>
  );
};

export default Billing;