import React, { useState } from "react";
import { useStore } from "@/store/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, isAfter } from "date-fns";
import { toast } from "sonner";
import { Printer } from "lucide-react";

const Billing = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const { products, orders, expenses } = useStore();

  // Filter data based on selected time period
  const filterData = (date: Date) => {
    let startDate;
    const now = new Date();

    switch (timeFilter) {
      case "daily":
        startDate = startOfDay(now);
        break;
      case "weekly":
        startDate = startOfWeek(now);
        break;
      case "monthly":
        startDate = startOfMonth(now);
        break;
      case "yearly":
        startDate = startOfYear(now);
        break;
      default:
        return true;
    }

    return isAfter(date, startDate);
  };

  // Calculate totals for each product
  const productTotals = products.map(product => {
    const productOrders = orders.filter(
      order => order.productId === product.id && filterData(order.date)
    );
    
    const totalQuantity = productOrders.reduce((sum, order) => sum + order.quantity, 0);
    const totalAmount = productOrders.reduce((sum, order) => sum + order.total, 0);
    const unpaidAmount = productOrders
      .filter(order => !order.isPaid)
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
  const totalExpenses = expenses
    .filter(expense => filterData(expense.date))
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalSales = productTotals.reduce((sum, product) => sum + product.amount, 0);
  const totalUnpaid = productTotals.reduce((sum, product) => sum + product.unpaid, 0);
  const netProfit = totalSales - totalExpenses - totalUnpaid;

  const handlePrint = () => {
    window.print();
    toast.success("Preparing print view...");
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Billing Summary</h1>
          <div className="flex gap-4">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead>Total Sales (NPR)</TableHead>
                <TableHead>Unpaid Amount (NPR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productTotals.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.amount.toLocaleString()}</TableCell>
                  <TableCell>{product.unpaid.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell className="font-bold">Total Expenses</TableCell>
                <TableCell></TableCell>
                <TableCell colSpan={2} className="font-bold text-destructive">
                  NPR {totalExpenses.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableCell className="font-bold">Net Profit</TableCell>
                <TableCell></TableCell>
                <TableCell colSpan={2} className={`font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                  NPR {netProfit.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Billing;