import { useState } from "react";
import { useStore } from "@/store/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

const ExpenseTable = () => {
  const { expenses } = useStore();
  const [filter, setFilter] = useState({
    category: "",
    search: "",
  });

  const filteredExpenses = expenses.filter((expense) => {
    if (filter.category && expense.category !== filter.category) return false;
    if (filter.search && !expense.description.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    const csvContent = [
      ["Date", "Category", "Amount", "Description"],
      ...filteredExpenses.map((expense) => [
        format(expense.date, "yyyy-MM-dd"),
        expense.category,
        expense.amount.toString(),
        expense.description,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={filter.category} onValueChange={(value) => setFilter({ ...filter, category: value })}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="salaries">Salaries</SelectItem>
            <SelectItem value="supplies">Supplies</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search expenses..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="w-full sm:w-[300px]"
        />

        <Button variant="outline" className="ml-auto" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{format(expense.date, "MMM d, yyyy")}</TableCell>
                <TableCell className="capitalize">{expense.category}</TableCell>
                <TableCell>NPR {expense.amount.toLocaleString()}</TableCell>
                <TableCell>{expense.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ExpenseTable;