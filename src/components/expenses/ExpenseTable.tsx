import { useState } from "react";
import { useStore } from "@/store/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";

const ExpenseTable = () => {
  const expenses = useStore((state) => state.expenses);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const exportToCSV = () => {
    const headers = ["Date", "Category", "Amount (NPR)", "Description"];
    const csvData = filteredExpenses.map((expense) => [
      new Date(expense.date).toLocaleDateString(),
      expense.category,
      expense.amount.toFixed(2),
      expense.description,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Expense Summary</h2>
          <div className="space-y-2">
            <p className="text-lg">Total Expenses: NPR {totalExpenses.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              Total number of transactions: {expenses.length}
            </p>
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount (NPR)</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="capitalize">{expense.category}</TableCell>
                  <TableCell>NPR {expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;