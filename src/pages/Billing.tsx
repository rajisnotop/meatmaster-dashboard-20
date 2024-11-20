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
import { Checkbox } from "@/components/ui/checkbox";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, isAfter } from "date-fns";
import { toast } from "sonner";
import { Printer } from "lucide-react";

const Billing = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
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

  const overallTotals = {
    quantity: productTotals.reduce((sum, product) => sum + product.quantity, 0),
    sales: productTotals.reduce((sum, product) => sum + product.amount, 0),
    unpaid: productTotals.reduce((sum, product) => sum + product.unpaid, 0),
  };

  const netProfit = overallTotals.sales - totalExpenses - overallTotals.unpaid;

  const handlePrint = (type: 'all' | 'selected') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Unable to open print window");
      return;
    }

    let productsToShow = type === 'all' 
      ? productTotals 
      : productTotals.filter(product => selectedProducts.includes(product.id));

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
            .net-profit { color: ${netProfit >= 0 ? 'green' : 'red'}; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Billing Report - ${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Total Sales (NPR)</th>
                ${type === 'all' ? '<th>Unpaid Amount (NPR)</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${productsToShow.map(product => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.quantity}</td>
                  <td>${product.amount.toLocaleString()}</td>
                  ${type === 'all' ? `<td>${product.unpaid.toLocaleString()}</td>` : ''}
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>Total</td>
                <td>${productsToShow.reduce((sum, p) => sum + p.quantity, 0)}</td>
                <td>NPR ${productsToShow.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</td>
                ${type === 'all' ? `<td>NPR ${productsToShow.reduce((sum, p) => sum + p.unpaid, 0).toLocaleString()}</td>` : ''}
              </tr>
              ${type === 'all' ? `
                <tr>
                  <td colspan="2">Total Expenses</td>
                  <td colspan="2" style="color: red;">NPR ${totalExpenses.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colspan="2">Net Profit</td>
                  <td colspan="2" class="net-profit">NPR ${netProfit.toLocaleString()}</td>
                </tr>
              ` : ''}
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
            <Button onClick={() => handlePrint('all')} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print All
            </Button>
            <Button 
              onClick={() => handlePrint('selected')} 
              variant="outline"
              disabled={selectedProducts.length === 0}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Selected
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead>Total Sales (NPR)</TableHead>
                <TableHead>Unpaid Amount (NPR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productTotals.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => {
                        setSelectedProducts(prev => 
                          checked 
                            ? [...prev, product.id]
                            : prev.filter(id => id !== product.id)
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.amount.toLocaleString()}</TableCell>
                  <TableCell>{product.unpaid.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell></TableCell>
                <TableCell>Total</TableCell>
                <TableCell>{overallTotals.quantity}</TableCell>
                <TableCell>NPR {overallTotals.sales.toLocaleString()}</TableCell>
                <TableCell>NPR {overallTotals.unpaid.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableCell></TableCell>
                <TableCell className="font-bold">Total Expenses</TableCell>
                <TableCell></TableCell>
                <TableCell colSpan={2} className="font-bold text-destructive">
                  NPR {totalExpenses.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableCell></TableCell>
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