import React, { useState } from "react";
import { useStore } from "@/store/store";
import { toast } from "sonner";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import BillingTable from "@/components/billing/BillingTable";
import BillingHeader from "@/components/billing/BillingHeader";
import BillingCard from "@/components/billing/BillingCard";
import Header from "@/components/Header";
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
      const filterDate = parseISO(dateFilter);
      return isDateInRange(date, format(filterDate, "yyyy-MM-dd"), format(filterDate, "yyyy-MM-dd"));
    }

    const dateRange = getDateRangeForFilter(timeFilter, dateFilter);
    if (!dateRange) return true;
    
    return isAfter(date, dateRange.start) && isBefore(date, dateRange.end);
  };

  // Calculate totals using the utility functions
  const productTotals = calculateProductTotals(products, orders, filterData);
  const overallTotals = calculateOverallTotals(productTotals);

  // Calculate filtered expenses and net profit
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

    let productsToShow =
      type === "all"
        ? productTotals
        : productTotals.filter((product) => selectedProducts.includes(product.id));

    const html = `
      <html>
        <head>
          <title>Billing Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .total-row { font-weight: bold; background-color: #f0f0f0; }
            .net-profit { color: ${netProfit >= 0 ? "green" : "red"}; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Billing Report - ${
            timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)
          }</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Total Sales (NPR)</th>
                ${type === "all" ? "<th>Unpaid Amount (NPR)</th>" : ""}
              </tr>
            </thead>
            <tbody>
              ${productsToShow
                .map(
                  (product) => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.quantity}</td>
                  <td>${product.amount.toLocaleString()}</td>
                  ${
                    type === "all"
                      ? `<td>${product.unpaid.toLocaleString()}</td>`
                      : ""
                  }
                </tr>
              `
                )
                .join("")}
              <tr class="total-row">
                <td>Total</td>
                <td>${productsToShow.reduce((sum, p) => sum + p.quantity, 0)}</td>
                <td>NPR ${productsToShow
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}</td>
                ${
                  type === "all"
                    ? `<td>NPR ${productsToShow
                        .reduce((sum, p) => sum + p.unpaid, 0)
                        .toLocaleString()}</td>`
                    : ""
                }
              </tr>
              ${
                type === "all"
                  ? `
                <tr>
                  <td colspan="2">Total Expenses</td>
                  <td colspan="2" style="color: red;">NPR ${totalExpenses.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colspan="2">Net Profit</td>
                  <td colspan="2" class="net-profit">NPR ${netProfit.toLocaleString()}</td>
                </tr>
              `
                  : ""
              }
            </tbody>
          </table>
          <button onclick="window.print()">Print Report</button>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    toast.success("Preparing print view...");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 space-y-8">
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
