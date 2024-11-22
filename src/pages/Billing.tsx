import React, { useState } from "react";
import { useStore } from "@/store/store";
import { toast } from "sonner";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import * as XLSX from 'xlsx';
import BillingTable from "@/components/billing/BillingTable";
import BillingHeader from "@/components/billing/BillingHeader";
import BillingCard from "@/components/billing/BillingCard";
import Header from "@/components/Header";
import { calculateProductTotals, calculateOverallTotals } from "@/utils/billingCalculations";
import { isDateInRange, getDateRangeForFilter } from "@/utils/dateFilters";

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
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([
        [{ v: 'Neelkanta Meat Shop', t: 's', s: { font: { bold: true, sz: 16 }, alignment: { horizontal: 'center' } } }],
        [{ v: 'Billing Summary Report', t: 's', s: { font: { bold: true, sz: 14 }, alignment: { horizontal: 'center' } } }],
        [{ 
          v: timeFilter === "date-range" && startDate && endDate 
            ? `Date Range: ${format(new Date(startDate), 'MMM dd, yyyy')} to ${format(new Date(endDate), 'MMM dd, yyyy')}`
            : `Period: ${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}`,
          t: 's',
          s: { font: { sz: 12 }, alignment: { horizontal: 'center' } }
        }],
        [{ v: `Generated on: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, t: 's', s: { font: { sz: 12 }, alignment: { horizontal: 'center' } } }],
        [''], // Empty row for spacing
        [
          { v: 'Product', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "E5E7EB" } } } },
          { v: 'Quantity Sold', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "E5E7EB" } } } },
          { v: 'Total Sales (NPR)', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "E5E7EB" } } } },
          { v: 'Paid with QR (NPR)', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "E5E7EB" } } } },
          { v: 'Unpaid Amount (NPR)', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "E5E7EB" } } } },
          { v: 'Unpaid to Paid with QR (NPR)', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "E5E7EB" } } } }
        ],
        ...productTotals.map(product => [
          { v: product.name, t: 's' },
          { v: product.quantity, t: 'n', z: '#,##0.00' },
          { v: product.amount, t: 'n', z: '#,##0.00' },
          { v: product.paidWithQR, t: 'n', z: '#,##0.00' },
          { v: product.unpaid, t: 'n', z: '#,##0.00' },
          { v: product.unpaidToPaidQR, t: 'n', z: '#,##0.00' }
        ]),
        [''], // Empty row for spacing
        [
          { v: 'Total', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "F3F4F6" } } } },
          { v: overallTotals.quantity, t: 'n', s: { font: { bold: true } }, z: '#,##0.00' },
          { v: overallTotals.sales, t: 'n', s: { font: { bold: true } }, z: '#,##0.00' },
          { v: overallTotals.paidWithQR, t: 'n', s: { font: { bold: true } }, z: '#,##0.00' },
          { v: overallTotals.unpaid, t: 'n', s: { font: { bold: true } }, z: '#,##0.00' },
          { v: overallTotals.unpaidToPaidQR, t: 'n', s: { font: { bold: true } }, z: '#,##0.00' }
        ],
        [''], // Empty row for spacing
        [
          { v: 'Additional Information', t: 's', s: { font: { bold: true, sz: 12 } } }
        ],
        [
          { v: 'Opening Balance', t: 's' },
          { v: openingBalance, t: 'n', z: '#,##0.00' }
        ],
        [
          { v: 'Total Expenses', t: 's' },
          { v: totalExpenses, t: 'n', z: '#,##0.00' }
        ],
        [
          { v: 'Cash in Counter', t: 's', s: { font: { bold: true } } },
          { 
            v: (overallTotals.sales || 0) - (totalExpenses || 0) + (openingBalance || 0),
            t: 'n',
            s: { font: { bold: true } },
            z: '#,##0.00'
          }
        ],
        [
          { v: 'Net Profit', t: 's', s: { font: { bold: true } } },
          { 
            v: netProfit,
            t: 'n',
            s: { font: { bold: true }, font: { color: { rgb: netProfit >= 0 ? "008000" : "FF0000" } } },
            z: '#,##0.00'
          }
        ]
      ]);

      // Set column widths
      ws['!cols'] = [
        { wch: 30 }, // Product
        { wch: 15 }, // Quantity
        { wch: 20 }, // Sales
        { wch: 20 }, // QR
        { wch: 20 }, // Unpaid
        { wch: 25 }, // Unpaid to QR
      ];

      // Merge cells for header
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Shop name
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, // Report title
        { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } }, // Date range
        { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } }, // Generated date
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Billing Summary');

      // Generate filename based on date range
      let fileName = `billing-summary`;
      if (timeFilter === "date-range" && startDate && endDate) {
        fileName += `-${format(new Date(startDate), 'yyyy-MM-dd')}-to-${format(new Date(endDate), 'yyyy-MM-dd')}`;
      } else {
        fileName += `-${timeFilter}-${format(new Date(), 'yyyy-MM-dd')}`;
      }
      fileName += '.xlsx';

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
      <main className="container mx-auto py-8 space-y-8">
        <BillingCard>
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
