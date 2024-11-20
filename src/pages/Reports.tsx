import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import RevenueChart from "@/components/RevenueChart";

const Reports = () => {
  const { orders, products, expenses } = useStore();

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const handlePrintReport = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Error",
          description: "Please allow pop-ups to print the report",
          variant: "destructive",
        });
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Financial Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .metric { margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Financial Report</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="section">
              <h2>Financial Summary</h2>
              <div class="metric">Total Revenue: NPR ${totalRevenue.toLocaleString()}</div>
              <div class="metric">Total Expenses: NPR ${totalExpenses.toLocaleString()}</div>
              <div class="metric">Net Profit: NPR ${netProfit.toLocaleString()}</div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
      
      toast({
        title: "Success",
        description: "Report sent to printer",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
          <Button 
            variant="outline" 
            className="hover:bg-primary/20"
            onClick={handlePrintReport}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6">Financial Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">NPR {totalRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">NPR {totalExpenses.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold text-primary">NPR {netProfit.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6">Revenue Trend</h2>
            <RevenueChart />
          </Card>

          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6">Expense Breakdown</h2>
            <div className="space-y-4">
              {Object.entries(
                expenses.reduce((acc, expense) => {
                  acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="capitalize">{category}</span>
                  <span className="font-semibold">NPR {amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;