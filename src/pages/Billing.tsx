import React, { useState } from "react";
import { useStore } from "@/store/store";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  startOfDay, 
  startOfWeek, 
  startOfMonth, 
  startOfYear, 
  isAfter, 
  isBefore, 
  endOfDay, 
  endOfWeek, 
  endOfMonth, 
  endOfYear,
  parseISO,
  format 
} from "date-fns";
import * as XLSX from 'xlsx';
import BillingTable from "@/components/billing/BillingTable";
import BillingHeader from "@/components/billing/BillingHeader";
import Header from "@/components/Header";
import { calculateProductTotals, calculateOverallTotals } from "@/utils/billingCalculations";

const Billing = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const { products, orders, expenses } = useStore();

  const filterData = (date: Date) => {
    let startDate, endDate;
    const now = new Date();

    // Check date filter first
    if (dateFilter) {
      const filterDate = parseISO(dateFilter);
      const start = startOfDay(filterDate);
      const end = endOfDay(filterDate);
      return isAfter(date, start) && isBefore(date, end);
    }

    // If no date filter, check time period filter
    if (timeFilter === "all") return true;

    switch (timeFilter) {
      case "daily":
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case "weekly":
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case "monthly":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "yearly":
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        return true;
    }

    return isAfter(date, startDate) && isBefore(date, endDate);
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
      // Prepare data for Excel
      const excelData = [
        // Headers
        ['Product', 'Quantity Sold', 'Total Sales (NPR)', 'Paid with QR (NPR)', 'Unpaid Amount (NPR)', 'Unpaid to Paid with QR (NPR)'],
        // Product rows
        ...productTotals.map(product => [
          product.name,
          product.quantity,
          product.amount,
          product.paidWithQR,
          product.unpaid,
          product.unpaidToPaidQR
        ]),
        // Empty row
        [],
        // Summary rows
        ['Total', overallTotals.quantity, overallTotals.sales, overallTotals.paidWithQR, overallTotals.unpaid, overallTotals.unpaidToPaidQR],
        ['Opening Balance', '', openingBalance],
        ['Total Expenses', '', totalExpenses],
        ['Cash in Counter', '', (overallTotals.sales || 0) - (totalExpenses || 0) + (openingBalance || 0)],
        ['Net Amount', '', netProfit]
      ];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Billing Summary');

      // Generate filename with current date
      const fileName = `billing-summary-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);
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
      <main className="container mx-auto py-8 space-y-6">
        <Card className="p-6">
          <BillingHeader
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            selectedProducts={selectedProducts}
            onPrint={handlePrint}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            onExportExcel={handleExportExcel}
          />
          <div className="rounded-md border">
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
        </Card>
      </main>
    </div>
  );
};

export default Billing;
