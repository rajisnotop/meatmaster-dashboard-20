import { useState } from "react";
import { useStore } from "@/store/store";
import { Card } from "@/components/ui/card";
import ExpenseTable from "./ExpenseTable";
import ExpenseFilters from "./ExpenseFilters";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ExpenseListView = () => {
  const { expenses } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    category: "all"
  });

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAmount = (!filters.minAmount || expense.amount >= Number(filters.minAmount)) &&
                         (!filters.maxAmount || expense.amount <= Number(filters.maxAmount));
    const matchesDate = (!filters.startDate || new Date(expense.date) >= new Date(filters.startDate)) &&
                       (!filters.endDate || new Date(expense.date) <= new Date(filters.endDate));
    const matchesCategory = filters.category === "all" || expense.category === filters.category;

    return matchesSearch && matchesAmount && matchesDate && matchesCategory;
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <ExpenseFilters onFilterChange={setFilters} />
      </div>
      <ExpenseTable expenses={filteredExpenses} />
    </Card>
  );
};

export default ExpenseListView;