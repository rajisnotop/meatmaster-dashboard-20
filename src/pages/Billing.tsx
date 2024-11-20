import React, { useState } from "react";
import { useStore } from "@/store/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer } from "lucide-react";
import { toast } from "sonner";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, isAfter, isBefore, endOfDay, endOfWeek, endOfMonth, endOfYear } from "date-fns";
import BillingTable from "@/components/billing/BillingTable";
import Header from "@/components/Header";

const Billing = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { products, orders, expenses } = useStore();

  // Filter data based on selected time period
  const filterData = (date: Date) => {
    let startDate, endDate;
    const now = new Date();

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

  // Calculate totals for each product
  const productTotals = products.map((product) => {
    const productOrders = orders.filter((order) => {
      const orderDate = new Date(order.date);
      return order.productId === product.id && filterData(orderDate);
    });

    const totalQuantity = productOrders.reduce((sum, order) => sum + order.quantity, 0);
    const totalAmount = productOrders.reduce((sum, order) => sum + order.total, 0);
    const unpaidAmount = productOrders
      .filter((order) => !order.isPaid)
      .reduce((sum, order) => sum + order.total, 0);

    return {
      id: product.id,
      name: product.name,
      quantity: totalQuantity,
      amount: totalAmount,
      unpaid: unpaidAmount,
    };
  });

  // Calculate overall totals
  const filteredExpenses = expenses
    .filter((expense) => filterData(new Date(expense.date)));

  const totalExpenses = filteredExpenses
    .reduce((sum, expense) => sum + expense.amount, 0);

  const overallTotals = {
    quantity: productTotals.reduce((sum, product) => sum + product.quantity, 0),
    sales: productTotals.reduce((sum, product) => sum + product.amount, 0),
    unpaid: productTotals.reduce((sum, product) => sum + product.unpaid, 0),
  };

  const netProfit = overallTotals.sales - totalExpenses - overallTotals.unpaid;

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Billing Summary</h1>
            <div className="flex gap-4">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handlePrint("all")} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print All
              </Button>
              <Button
                onClick={() => handlePrint("selected")}
                variant="outline"
                disabled={selectedProducts.length === 0}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Selected
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <BillingTable
              productTotals={productTotals}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              overallTotals={overallTotals}
              totalExpenses={totalExpenses}
              netProfit={netProfit}
            />
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Billing;